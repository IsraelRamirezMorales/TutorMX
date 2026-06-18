#!/usr/bin/env python3
import os
import sys
import csv
import json
from datetime import datetime
from dotenv import load_dotenv

# Try importing psycopg2 or psycopg (v3) as a fallback
try:
    import psycopg2
    import psycopg2.extras
    import psycopg2.extensions
    USING_PSYCOPG2 = True
except ImportError:
    try:
        import psycopg as psycopg2
        USING_PSYCOPG2 = False
    except ImportError:
        print("[ERROR] psycopg2 o psycopg (v3) es requerido para ejecutar este script.")
        print("Por favor instálalo ejecutando: pip install psycopg2-binary")
        sys.exit(1)

# Try importing reportlab for PDF generation
try:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
    )
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.pdfgen import canvas
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute total pages and render headers/footers."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return

        self.saveState()
        primary_color = colors.HexColor("#0F172A") # Slate 900
        text_muted = colors.HexColor("#64748B") # Slate 500
        border_color = colors.HexColor("#E2E8F0") # Slate 200
        accent_color = colors.HexColor("#0D9488") # Teal 600
        
        # Header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(accent_color)
        self.drawString(54, 750, "TUTORMX / INTRU-HUB")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(text_muted)
        self.drawRightString(558, 750, "DICCIONARIO DE DATOS Y RELACIONES")
        
        # Header Line
        self.setStrokeColor(border_color)
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        
        # Footer
        self.line(54, 55, 558, 55)
        self.setFont("Helvetica", 8)
        self.drawString(54, 42, f"Generado: {datetime.now().strftime('%d/%m/%Y')}")
        self.drawCentredString(306, 42, "Esquema PostgreSQL - Confidencial")
        
        page_str = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(558, 42, page_str)
        
        self.restoreState()


def get_spanish_date():
    months = {
        1: "enero", 2: "febrero", 3: "marzo", 4: "abril", 5: "mayo", 6: "junio",
        7: "julio", 8: "agosto", 9: "septiembre", 10: "octubre", 11: "noviembre", 12: "diciembre"
    }
    now = datetime.now()
    return f"{now.day} de {months[now.month]} de {now.year}"


def fetch_database_schema(db_url):
    """Connects to the database and fetches tables, columns, primary keys, foreign keys, and enums."""
    print(f"[INFO] Conectando a la base de datos...")
    
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    schema_info = {
        "tables": {},
        "enums": {},
        "foreign_keys": []
    }
    
    # 1. Fetch all columns info
    print("[INFO] Consultando columnas y tipos de datos...")
    columns_query = """
        SELECT 
            table_name, 
            column_name, 
            data_type, 
            is_nullable, 
            column_default,
            udt_name
        FROM 
            information_schema.columns 
        WHERE 
            table_schema = 'public' 
        ORDER BY 
            table_name, ordinal_position;
    """
    cursor.execute(columns_query)
    columns_rows = cursor.fetchall()
    
    for row in columns_rows:
        table_name, column_name, data_type, is_nullable, column_default, udt_name = row
        
        if table_name not in schema_info["tables"]:
            schema_info["tables"][table_name] = {
                "name": table_name,
                "columns": []
            }
            
        # Clean type: if USER-DEFINED (like custom domain or enum), use udt_name
        final_type = data_type
        if data_type.upper() == 'USER-DEFINED':
            final_type = udt_name
            
        schema_info["tables"][table_name]["columns"].append({
            "name": column_name,
            "type": final_type,
            "nullable": is_nullable,
            "default": column_default,
            "is_pk": False,
            "fk_target": None
        })
        
    # 2. Fetch Primary Keys
    print("[INFO] Consultando llaves primarias...")
    pk_query = """
        SELECT 
            kcu.table_name,
            kcu.column_name
        FROM 
            information_schema.table_constraints tc 
            JOIN information_schema.key_column_usage kcu 
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
        WHERE 
            tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema = 'public';
    """
    cursor.execute(pk_query)
    pk_rows = cursor.fetchall()
    for row in pk_rows:
        table_name, column_name = row
        if table_name in schema_info["tables"]:
            for col in schema_info["tables"][table_name]["columns"]:
                if col["name"] == column_name:
                    col["is_pk"] = True

    # 3. Fetch Foreign Keys
    print("[INFO] Consultando llaves foráneas...")
    fk_query = """
        SELECT
            cl.relname AS source_table,
            a.attname AS source_column,
            cl_ref.relname AS target_table,
            a_ref.attname AS target_column
        FROM
            pg_constraint co
            JOIN pg_class cl ON co.conrelid = cl.oid
            JOIN pg_namespace n ON cl.relnamespace = n.oid
            JOIN pg_attribute a ON a.attrelid = cl.oid AND a.attnum = ANY(co.conkey)
            JOIN pg_class cl_ref ON co.confrelid = cl_ref.oid
            JOIN pg_attribute a_ref ON a_ref.attrelid = cl_ref.oid AND a_ref.attnum = ANY(co.confkey)
        WHERE
            co.contype = 'f'
            AND n.nspname = 'public';
    """
    cursor.execute(fk_query)
    fk_rows = cursor.fetchall()
    for row in fk_rows:
        src_table, src_col, tgt_table, tgt_col = row
        schema_info["foreign_keys"].append({
            "source_table": src_table,
            "source_column": src_col,
            "target_table": tgt_table,
            "target_column": tgt_col
        })
        
        # Link to column info
        if src_table in schema_info["tables"]:
            for col in schema_info["tables"][src_table]["columns"]:
                if col["name"] == src_col:
                    col["fk_target"] = f"{tgt_table}.{tgt_col}"

    # 4. Fetch Enums
    print("[INFO] Consultando tipos ENUM...")
    enum_query = """
        SELECT 
            t.typname AS enum_name,  
            e.enumlabel AS enum_value
        FROM 
            pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        WHERE 
            n.nspname = 'public'
        ORDER BY 
            enum_name, e.enumsortorder;
    """
    cursor.execute(enum_query)
    enum_rows = cursor.fetchall()
    for row in enum_rows:
        enum_name, enum_val = row
        if enum_name not in schema_info["enums"]:
            schema_info["enums"][enum_name] = []
        schema_info["enums"][enum_name].append(enum_val)

    cursor.close()
    conn.close()
    
    print("[INFO] Datos de base de datos extraídos con éxito.")
    return schema_info


def save_dictionary_to_files(schema):
    """Saves the data dictionary to JSON and CSV files."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "data_dictionary.json")
    csv_path = os.path.join(script_dir, "data_dictionary.csv")
    
    # 1. Save to JSON
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=4, ensure_ascii=False)
    print(f"[INFO] Diccionario guardado como '{json_path}'.")
    
    # 2. Save flat CSV representation (columns list)
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["table_name", "column_name", "data_type", "is_nullable", "column_default", "is_primary_key", "foreign_key_target"])
        for t_name, table in sorted(schema["tables"].items()):
            for col in table["columns"]:
                writer.writerow([
                    t_name,
                    col["name"],
                    col["type"],
                    col["nullable"],
                    col["default"] if col["default"] is not None else "",
                    "YES" if col["is_pk"] else "NO",
                    col["fk_target"] if col["fk_target"] else ""
                ])
    print(f"[INFO] Diccionario guardado como '{csv_path}'.")


def generate_pdf_dictionary(schema, output_pdf):
    """Builds a beautiful PDF documentation report from the schema dict."""
    if not HAS_REPORTLAB:
        print("[WARNING] ReportLab no está instalado. Saltando generación de PDF.")
        return

    print(f"[INFO] Generando PDF de documentación en '{output_pdf}'...")
    
    total_tables = len(schema["tables"])
    total_enums = len(schema["enums"])
    total_fkeys = len(schema["foreign_keys"])
    total_columns = sum(len(t["columns"]) for t in schema["tables"].values())

    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()
    
    # Modify default body
    styles['Normal'].textColor = colors.HexColor("#334155")
    styles['Normal'].fontSize = 10
    styles['Normal'].leading = 14

    # Custom styles
    styles.add(ParagraphStyle(
        name='CoverTeaser',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#0D9488"),
        spaceAfter=12
    ))

    styles.add(ParagraphStyle(
        name='CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=30,
        leading=36,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=16,
        leading=22,
        textColor=colors.HexColor("#475569"),
        spaceAfter=40
    ))

    styles.add(ParagraphStyle(
        name='CoverDescription',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        textColor=colors.HexColor("#334155"),
        spaceAfter=40
    ))

    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=24,
        spaceAfter=12,
        keepWithNext=True
    ))

    styles.add(ParagraphStyle(
        name='TableTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=16,
        textColor=colors.HexColor("#0F172A")
    ))

    styles.add(ParagraphStyle(
        name='TableMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#64748B"),
        alignment=2
    ))

    styles.add(ParagraphStyle(
        name='ColHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    ))

    styles.add(ParagraphStyle(
        name='CellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1E293B")
    ))

    styles.add(ParagraphStyle(
        name='CellCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    ))

    styles.add(ParagraphStyle(
        name='CellEnumItem',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0D9488")
    ))

    styles.add(ParagraphStyle(
        name='CellNull',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#94A3B8")
    ))

    styles.add(ParagraphStyle(
        name='CellNotNull',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0D9488")
    ))

    styles.add(ParagraphStyle(
        name='CellMuted',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#94A3B8")
    ))

    story = []

    # ==================== PORTADA (COVER PAGE) ====================
    story.append(Spacer(1, 80))
    story.append(Paragraph("DOCUMENTACIÓN DE SISTEMAS", styles['CoverTeaser']))
    story.append(Paragraph("Diccionario de Datos Completo", styles['CoverTitle']))
    story.append(Paragraph("TutorMX — Base de Datos Neon PostgreSQL", styles['CoverSubtitle']))
    
    # Decorative line
    bar_data = [['']]
    bar_table = Table(bar_data, colWidths=[504], rowHeights=[4])
    bar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0D9488")),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(bar_table)
    story.append(Spacer(1, 40))

    # Info card
    info_data = [
        [Paragraph("<b>Servidor de BD:</b>", styles['CellNormal']), Paragraph("Neon Cloud PostgreSQL (AWS us-east-1)", styles['CellNormal'])],
        [Paragraph("<b>Fecha de Extracción:</b>", styles['CellNormal']), Paragraph(get_spanish_date(), styles['CellNormal'])],
        [Paragraph("<b>Total de Tablas:</b>", styles['CellNormal']), Paragraph(str(total_tables), styles['CellNormal'])],
        [Paragraph("<b>Total de Enums:</b>", styles['CellNormal']), Paragraph(str(total_enums), styles['CellNormal'])],
        [Paragraph("<b>Llaves Foráneas:</b>", styles['CellNormal']), Paragraph(str(total_fkeys), styles['CellNormal'])],
        [Paragraph("<b>Total de Columnas:</b>", styles['CellNormal']), Paragraph(str(total_columns), styles['CellNormal'])],
    ]
    info_table = Table(info_data, colWidths=[150, 354])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 30))

    description_text = (
        "Este documento técnico es el Diccionario de Datos del proyecto <b>TutorMX</b>. "
        "Contiene el esquema completo inspeccionado directamente de la base de datos PostgreSQL, "
        "detallando las especificaciones físicas de cada tabla (columnas, tipos, restricciones PK/FK) "
        "así como los enums y las llaves foráneas definidas para mantener la integridad referencial."
    )
    story.append(Paragraph(description_text, styles['CoverDescription']))
    
    story.append(Spacer(1, 40))
    story.append(Paragraph("<font size=8 color='#94A3B8'>© 2026 TutorMX. Confidencial e Interno.</font>", styles['CellNormal']))
    
    story.append(PageBreak())

    # ==================== SECCIÓN DE ENUMS ====================
    if schema["enums"]:
        story.append(Paragraph("Tipos Enumerados (ENUMs)", styles['SectionHeader']))
        story.append(Paragraph("Los siguientes tipos personalizados (ENUMs) están definidos en el esquema público de la base de datos:", styles['CellNormal']))
        story.append(Spacer(1, 10))

        enum_table_data = [[
            Paragraph("<b>Nombre del ENUM</b>", styles['ColHeader']),
            Paragraph("<b>Valores Permitidos</b>", styles['ColHeader'])
        ]]

        for enum_name, values in sorted(schema["enums"].items()):
            val_paragraphs = ", ".join([f"<font color='#0D9488'><b>'{v}'</b></font>" for v in values])
            enum_table_data.append([
                Paragraph(f"<b>{enum_name}</b>", styles['CellNormal']),
                Paragraph(val_paragraphs, styles['CellNormal'])
            ])

        enum_table = Table(enum_table_data, colWidths=[180, 324])
        enum_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(enum_table)
        story.append(Spacer(1, 20))
        story.append(PageBreak())

    # ==================== SECCIÓN DE RELACIONES (FOREIGN KEYS) ====================
    if schema["foreign_keys"]:
        story.append(Paragraph("Llaves Foráneas y Relaciones", styles['SectionHeader']))
        story.append(Paragraph("Detalle de las llaves foráneas que controlan la integridad referencial y las uniones entre tablas:", styles['CellNormal']))
        story.append(Spacer(1, 10))

        fk_table_data = [[
            Paragraph("<b>Tabla Origen</b>", styles['ColHeader']),
            Paragraph("<b>Columna Origen</b>", styles['ColHeader']),
            Paragraph("<b>Tabla Destino</b>", styles['ColHeader']),
            Paragraph("<b>Columna Destino</b>", styles['ColHeader'])
        ]]

        for fk in sorted(schema["foreign_keys"], key=lambda x: (x["source_table"], x["source_column"])):
            fk_table_data.append([
                Paragraph(fk["source_table"], styles['CellNormal']),
                Paragraph(f"<code>{fk['source_column']}</code>", styles['CellNormal']),
                Paragraph(fk["target_table"], styles['CellNormal']),
                Paragraph(f"<code>{fk['target_column']}</code>", styles['CellNormal'])
            ])

        fk_table = Table(fk_table_data, colWidths=[126, 126, 126, 126])
        fk_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(fk_table)
        story.append(Spacer(1, 20))
        story.append(PageBreak())

    # ==================== TABLAS DETALLADAS ====================
    # Printable area: 504 pt. Allocation: Column (144pt), Type (130pt), Nullable (60pt), Default (170pt)
    col_widths = [144, 130, 60, 170]

    story.append(Paragraph("Estructura de las Tablas", styles['SectionHeader']))
    story.append(Spacer(1, 10))

    for t_name, table in sorted(schema["tables"].items()):
        table_elements = []
        
        # Section header for this table
        header_data = [
            [
                Paragraph(f"Tabla: <b>{t_name}</b>", styles['TableTitle']),
                Paragraph(f"{len(table['columns'])} columnas", styles['TableMeta'])
            ]
        ]
        header_table = Table(header_data, colWidths=[350, 154])
        header_table.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 1.5, colors.HexColor("#0D9488")),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ]))
        table_elements.append(header_table)
        table_elements.append(Spacer(1, 6))

        # Table data
        schema_table_data = [[
            Paragraph("Columna", styles['ColHeader']),
            Paragraph("Tipo de Dato", styles['ColHeader']),
            Paragraph("Nulo", styles['ColHeader']),
            Paragraph("Valor por Defecto", styles['ColHeader'])
        ]]

        for col in table["columns"]:
            c_name = col["name"]
            
            # Format Column Name with Keys icons/hints
            name_text = c_name
            if col["is_pk"]:
                name_text = f"🔑 <b>{c_name}</b> <font size=7 color='#EAB308'>[PK]</font>"
            elif col["fk_target"]:
                name_text = f"🔗 <b>{c_name}</b> <br/><font size=7 color='#3B82F6'>[FK &rarr; {col['fk_target']}]</font>"
            else:
                name_text = f"<b>{c_name}</b>"

            # Format nullable label
            if col["nullable"].upper() in ("NO", "FALSE"):
                null_para = Paragraph("No", styles['CellNotNull'])
            else:
                null_para = Paragraph("Sí", styles['CellNull'])

            # Format default value
            def_val = col["default"]
            if not def_val or str(def_val).upper() == 'NULL':
                def_para = Paragraph("—", styles['CellMuted'])
            else:
                def_para = Paragraph(str(def_val), styles['CellCode'])

            schema_table_data.append([
                Paragraph(name_text, styles['CellNormal']),
                Paragraph(col["type"], styles['CellCode']),
                null_para,
                def_para
            ])

        schema_table = Table(schema_table_data, colWidths=col_widths)
        schema_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('TOPPADDING', (0, 0), (-1, 0), 6),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0, 1), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
        ]))
        
        table_elements.append(schema_table)
        table_elements.append(Spacer(1, 20))
        story.append(KeepTogether(table_elements))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[INFO] PDF de documentación generado con éxito en '{output_pdf}'.")


def main():
    print("=" * 60)
    print(" GENERADOR DE DICCIONARIO DE DATOS BD ".center(60, "="))
    print("=" * 60)
    
    # Load environment variables
    load_dotenv()
    
    # Fallback paths (parent directory, and backend/ directory)
    if not os.getenv("DATABASE_URL"):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        load_dotenv(os.path.join(script_dir, "..", ".env"))
    if not os.getenv("DATABASE_URL"):
        script_dir = os.path.dirname(os.path.abspath(__file__))
        load_dotenv(os.path.join(script_dir, "..", "backend", ".env"))
        
    db_url = os.getenv("DATABASE_URL")
    
    if not db_url:
        print("[ERROR] No se encontró la variable DATABASE_URL en el entorno.")
        print("Asegúrate de tener un archivo .env en la raíz con: DATABASE_URL=...")
        sys.exit(1)
        
    try:
        # Fetch data
        schema = fetch_database_schema(db_url)
        
        # Save JSON/CSV dictionary files
        save_dictionary_to_files(schema)
        
        # Build PDF
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output_pdf = os.path.join(script_dir, "data_dictionary.pdf")
        generate_pdf_dictionary(schema, output_pdf)
        
        print("\n[ÉXITO] ¡Diccionario de datos generado correctamente!")
        print(f"Archivos creados:")
        print(f" - JSON: {os.path.abspath(os.path.join(script_dir, 'data_dictionary.json'))}")
        print(f" - CSV:  {os.path.abspath(os.path.join(script_dir, 'data_dictionary.csv'))}")
        print(f" - PDF:  {os.path.abspath(output_pdf)}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n[ERROR] Ocurrió un error inesperado al procesar la BD:")
        print(str(e))
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
