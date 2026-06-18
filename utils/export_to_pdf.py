#!/usr/bin/env python3
import os
import csv
import glob
import sys
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and render 'Page X of Y' 
    and document headers/footers on subsequent pages.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        # Save state for the second pass
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
        # Do not draw headers or footers on the cover page (Page 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        
        # Coordinated color palette
        primary_color = colors.HexColor("#0F172A") # Slate 900
        text_muted = colors.HexColor("#64748B") # Slate 500
        border_color = colors.HexColor("#E2E8F0") # Slate 200
        accent_color = colors.HexColor("#0D9488") # Teal 600
        
        # Header (Top of the page)
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(accent_color)
        self.drawString(54, 750, "TUTORMX / INTRU-HUB")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(text_muted)
        self.drawRightString(558, 750, "DICCIONARIO DE BASE DE DATOS")
        
        # Header Line
        self.setStrokeColor(border_color)
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        
        # Footer (Bottom of the page)
        self.line(54, 55, 558, 55)
        self.setFont("Helvetica", 8)
        self.drawString(54, 42, f"Generado: {datetime.now().strftime('%d/%m/%Y')}")
        self.drawCentredString(306, 42, "Confidencial")
        
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


def read_csv_data(file_path):
    """Reads CSV data and returns a list of dictionaries, handling BOM and encoding issues."""
    try:
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            return list(reader)
    except UnicodeDecodeError:
        # Fallback to latin-1 if utf-8 fails
        with open(file_path, 'r', encoding='latin-1') as f:
            reader = csv.DictReader(f)
            return list(reader)


def build_schema_pdf(file_path, output_pdf, rows):
    """Generates a highly-stylized database schema PDF report."""
    # Organize columns by table_name
    tables_data = {}
    for row in rows:
        table_name = row.get("table_name", "Desconocida")
        if table_name not in tables_data:
            tables_data[table_name] = []
        tables_data[table_name].append(row)

    total_tables = len(tables_data)
    total_columns = len(rows)

    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=letter,
        leftMargin=54,  # 0.75 in
        rightMargin=54,
        topMargin=72,   # Leave space for header
        bottomMargin=72  # Leave space for footer
    )

    styles = getSampleStyleSheet()

    # Modify default styles for clean typography
    styles['Normal'].textColor = colors.HexColor("#334155") # Slate 700
    styles['Normal'].fontSize = 10
    styles['Normal'].leading = 14

    # Custom styles
    styles.add(ParagraphStyle(
        name='CoverTeaser',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#0D9488"), # Teal 600
        spaceAfter=12
    ))

    styles.add(ParagraphStyle(
        name='CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=colors.HexColor("#0F172A"), # Slate 900
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=16,
        leading=22,
        textColor=colors.HexColor("#475569"), # Slate 600
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
        name='TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=20,
        spaceAfter=10,
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
        alignment=2 # Right align
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
        textColor=colors.HexColor("#1E293B") # Slate 800
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
        textColor=colors.HexColor("#0D9488") # Teal 600
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

    # ==================== CUBIERTA (COVER PAGE) ====================
    story.append(Spacer(1, 80))
    story.append(Paragraph("DOCUMENTACIÓN TÉCNICA", styles['CoverTeaser']))
    story.append(Paragraph("Estructura de Base de Datos", styles['CoverTitle']))
    story.append(Paragraph("TutorMX — INTRU-HUB", styles['CoverSubtitle']))
    
    # Decorative color bar
    bar_data = [['']]
    bar_table = Table(bar_data, colWidths=[504], rowHeights=[4])
    bar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#0D9488")), # Teal
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(bar_table)
    story.append(Spacer(1, 40))

    # Metadata Info Box
    info_data = [
        [Paragraph("<b>Archivo de Origen:</b>", styles['CellNormal']), Paragraph(os.path.basename(file_path), styles['CellNormal'])],
        [Paragraph("<b>Fecha de Generación:</b>", styles['CellNormal']), Paragraph(get_spanish_date(), styles['CellNormal'])],
        [Paragraph("<b>Total de Tablas:</b>", styles['CellNormal']), Paragraph(str(total_tables), styles['CellNormal'])],
        [Paragraph("<b>Total de Columnas:</b>", styles['CellNormal']), Paragraph(str(total_columns), styles['CellNormal'])],
    ]
    info_table = Table(info_data, colWidths=[150, 354])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")), # Light Slate
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 40))

    description_text = (
        "Este documento detalla la estructura física de la base de datos de <b>TutorMX</b> "
        "(INTRU-HUB). Incluye los nombres de las tablas, sus columnas, tipos de datos "
        "asociados, nulabilidad y valores por defecto establecidos. Ha sido generado de forma "
        "automatizada a partir del diccionario de datos provisto en formato CSV."
    )
    story.append(Paragraph(description_text, styles['CoverDescription']))
    
    story.append(Spacer(1, 60))
    story.append(Paragraph("<font size=8 color='#94A3B8'>© 2026 TutorMX. Confidencial e Interno.</font>", styles['CellNormal']))
    
    story.append(PageBreak())

    # ==================== TABLA DE CONTENIDO (INDEX) ====================
    story.append(Paragraph("Resumen del Esquema", styles['TableHeader'] or styles['Heading2']))
    story.append(Spacer(1, 10))
    
    index_data = [[
        Paragraph("<b>Nombre de la Tabla</b>", styles['CellNormal']),
        Paragraph("<b>Total Columnas</b>", styles['CellNormal'])
    ]]
    for t_name, cols in sorted(tables_data.items()):
        index_data.append([
            Paragraph(f"<font color='#0D9488'><b>{t_name}</b></font>", styles['CellNormal']),
            Paragraph(str(len(cols)), styles['CellNormal'])
        ])
    
    index_table = Table(index_data, colWidths=[350, 154])
    index_table.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, 0), 1, colors.HexColor("#0F172A")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(index_table)
    story.append(PageBreak())

    # ==================== DETALLES DE TABLAS ====================
    # Set printable width = 504 pt (612 page width - 108 margins)
    # Allocation: Column (130pt), Type (140pt), Nullable (64pt), Default (170pt) = 504pt
    col_widths = [130, 140, 64, 170]

    for table_name, columns in sorted(tables_data.items()):
        table_elements = []
        
        # Styled section header card
        header_data = [
            [
                Paragraph(f"Tabla: <b>{table_name}</b>", styles['TableTitle']),
                Paragraph(f"{len(columns)} columnas", styles['TableMeta'])
            ]
        ]
        header_table = Table(header_data, colWidths=[350, 154])
        header_table.setStyle(TableStyle([
            ('LINEBELOW', (0, 0), (-1, -1), 1.5, colors.HexColor("#0D9488")), # Teal line
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ]))
        table_elements.append(header_table)
        table_elements.append(Spacer(1, 8))

        # Main Table details
        schema_table_data = [[
            Paragraph("Columna", styles['ColHeader']),
            Paragraph("Tipo de Dato", styles['ColHeader']),
            Paragraph("Nulo", styles['ColHeader']),
            Paragraph("Valor por Defecto", styles['ColHeader'])
        ]]

        for col in columns:
            col_name = col.get("column_name", "")
            data_type = col.get("data_type", "")
            is_nullable = col.get("is_nullable", "YES").upper()
            col_default = col.get("column_default", "")

            # Format nullable label
            if is_nullable in ("NO", "FALSE"):
                null_para = Paragraph("No", styles['CellNotNull'])
            else:
                null_para = Paragraph("Sí", styles['CellNull'])

            # Format default value
            if not col_default or col_default.upper() == 'NULL':
                def_para = Paragraph("—", styles['CellMuted'])
            else:
                def_para = Paragraph(col_default, styles['CellCode'])

            schema_table_data.append([
                Paragraph(f"<b>{col_name}</b>", styles['CellNormal']),
                Paragraph(data_type, styles['CellCode']),
                null_para,
                def_para
            ])

        schema_table = Table(schema_table_data, colWidths=col_widths)
        schema_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F172A")), # Slate 900 header
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

        # Keep the table title and the schema table together on the same page
        story.append(KeepTogether(table_elements))

    # Build the document using our custom canvas class
    doc.build(story, canvasmaker=NumberedCanvas)


def build_generic_pdf(file_path, output_pdf, rows):
    """Generates a beautifully styled table for generic CSV layouts."""
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()
    styles['Normal'].textColor = colors.HexColor("#334155")
    styles['Normal'].fontSize = 9
    styles['Normal'].leading = 12

    # Custom styles
    styles.add(ParagraphStyle(
        name='CoverTeaser',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#1E3A8A"), # Royal Blue
        spaceAfter=12
    ))

    styles.add(ParagraphStyle(
        name='CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=8
    ))

    styles.add(ParagraphStyle(
        name='CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=20,
        textColor=colors.HexColor("#475569"),
        spaceAfter=40
    ))

    styles.add(ParagraphStyle(
        name='ColHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    ))

    styles.add(ParagraphStyle(
        name='CellNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1E293B")
    ))

    story = []

    # COVER PAGE
    story.append(Spacer(1, 100))
    story.append(Paragraph("REPORTE DE DATOS", styles['CoverTeaser']))
    story.append(Paragraph(os.path.basename(file_path), styles['CoverTitle']))
    story.append(Paragraph(f"Exportación de datos de hoja de cálculo", styles['CoverSubtitle']))
    
    # Blue decoration line
    bar_data = [['']]
    bar_table = Table(bar_data, colWidths=[504], rowHeights=[4])
    bar_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1E3A8A")),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(bar_table)
    story.append(Spacer(1, 40))

    # Info table
    info_data = [
        [Paragraph("<b>Archivo de Origen:</b>", styles['CellNormal']), Paragraph(os.path.basename(file_path), styles['CellNormal'])],
        [Paragraph("<b>Fecha de Generación:</b>", styles['CellNormal']), Paragraph(get_spanish_date(), styles['CellNormal'])],
        [Paragraph("<b>Registros Procesados:</b>", styles['CellNormal']), Paragraph(str(len(rows)), styles['CellNormal'])],
    ]
    info_table = Table(info_data, colWidths=[150, 354])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
        ('PADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 60))
    story.append(PageBreak())

    # DATA TABLE PAGE(S)
    first_row = rows[0]
    headers = list(first_row.keys())
    col_count = len(headers)
    
    # Proportional column sizing
    printable_width = 504.0
    col_width = printable_width / col_count if col_count > 0 else printable_width
    col_widths = [col_width] * col_count

    table_data = []
    
    # Headers
    header_row = [Paragraph(f"<b>{h}</b>", styles['ColHeader']) for h in headers]
    table_data.append(header_row)

    # Data Rows
    for row in rows:
        data_row = []
        for h in headers:
            val = str(row.get(h, ''))
            data_row.append(Paragraph(val, styles['CellNormal']))
        table_data.append(data_row)

    data_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    data_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")), # Navy Header
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor("#FFFFFF"), colors.HexColor("#F8FAFC")]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
    ]))
    story.append(data_table)

    doc.build(story, canvasmaker=NumberedCanvas)


def main():
    print("=" * 60)
    print(" EXPORTADOR DE CSV A PDF PROFESIONAL ".center(60, "="))
    print("=" * 60)
    
    # Scan for CSV files in the current folder first, then the script's folder
    csv_files = glob.glob("*.csv") + glob.glob("*.CSV")
    if not csv_files:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        csv_files = glob.glob(os.path.join(script_dir, "*.csv")) + glob.glob(os.path.join(script_dir, "*.CSV"))
        
    if not csv_files:
        print("[ERROR] No se encontraron archivos .CSV en el directorio actual ni en la carpeta del script.")
        print("Por favor, asegúrate de colocar un archivo .csv.")
        sys.exit(1)
        
    # Order files, prioritize 'data-1781759231492.CSV' or select the first available
    target_csv = None
    for f in csv_files:
        if "data-1781759231492" in os.path.basename(f):
            target_csv = f
            break
            
    if not target_csv:
        target_csv = csv_files[0]
        
    print(f"\n[INFO] Archivo CSV seleccionado: '{target_csv}'")
    
    rows = read_csv_data(target_csv)
    if not rows:
        print("[ERROR] El archivo CSV está vacío o no tiene un formato válido.")
        sys.exit(1)
        
    # Determine the layout based on structure
    first_row = rows[0]
    is_schema = all(k in first_row for k in ['table_name', 'column_name'])
    
    output_pdf = os.path.splitext(target_csv)[0] + ".pdf"
    print(f"[INFO] Generando PDF de salida: '{output_pdf}'...")
    
    if is_schema:
        print("[INFO] Estructura de Diccionario de Datos detectada. Usando plantilla de base de datos...")
        build_schema_pdf(target_csv, output_pdf, rows)
    else:
        print("[INFO] CSV genérico detectado. Usando tabla de datos general...")
        build_generic_pdf(target_csv, output_pdf, rows)
        
    print(f"\n[ÉXITO] ¡PDF generado correctamente en: '{os.path.abspath(output_pdf)}'!")
    print("=" * 60)

if __name__ == "__main__":
    main()
