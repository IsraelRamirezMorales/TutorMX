#!/usr/bin/env python3
import os

# Define the README layouts and descriptions for each backend folder
backend_readmes = {
    "app/Console": {
        "title": "Console Commands & Tasks",
        "description": "Comandos personalizados de consola Artisan y tareas programadas (Cron Jobs) de Laravel.",
        "hus": [
            "**HU-025 (Flujo de Evaluación Post-Asesoría)**: Programación y envío automático de invitaciones/correos para reseñas de tutoría."
        ]
    },
    "app/Exceptions": {
        "title": "Exceptions Handler",
        "description": "Manejador centralizado de excepciones y errores de la aplicación.",
        "hus": [
            "**HU-006 (Inicio de Sesión)**: Captura y retorno estructurado de errores de credenciales inválidas y validaciones."
        ]
    },
    "app/Http/Controllers": {
        "title": "HTTP Controllers",
        "description": "Controladores HTTP que manejan las solicitudes REST provenientes del frontend.",
        "hus": [
            "**HU-005 (Registro de Usuario)**: `AuthController` para registro de usuarios y validaciones básicas.",
            "**HU-006 (Inicio de Sesión)**: `AuthController` para validación de credenciales y generación de JWT.",
            "**HU-007 (Persistencia de Sesión)**: Endpoint `/auth/me` para recuperar usuario autenticado y logout.",
            "**HU-011 (Gestión de Universidades)**: `UniversityController` con endpoint GET `/universities`.",
            "**HU-012 (Gestión de Materias)**: `SubjectController` con endpoint GET `/subjects`.",
            "**HU-013 (Perfil Básico de Usuario)**: `ProfileController` para actualización de datos y fotos.",
            "**HU-016 (Búsqueda de Tutores)**: `TutorController` para filtros de búsqueda de tutores.",
            "**HU-017 (Perfil Público de Tutor)**: `TutorController` para datos públicos y estadísticas del tutor.",
            "**HU-020 (Mensajería)**: `MessageController` para listado de conversaciones y envío de mensajes.",
            "**HU-022 (Convertirse en Tutor)**: `TutorRequestController` para procesar postulaciones de tutores.",
            "**HU-023 (Gestión de Logros Académicos)**: `AchievementController` para CRUD de logros.",
            "**HU-024 (Sistema de Reviews)**: `ReviewController` para registrar evaluaciones de tutores."
        ]
    },
    "app/Http/Middleware": {
        "title": "HTTP Middleware",
        "description": "Filtros e intermediarios que interceptan las peticiones HTTP entrantes.",
        "hus": [
            "**HU-007 (Persistencia de Sesión)**: `JwtMiddleware` para validar la existencia y expiración del token JWT.",
            "**HU-014 (Preparación de Roles de Usuario)**: Middleware de autorización para validar permisos (`USER`, `TUTOR`, `ADMIN`)."
        ]
    },
    "app/Http/Requests": {
        "title": "Form Requests Validation",
        "description": "Clases dedicadas a la validación de payloads y datos en peticiones HTTP entrantes.",
        "hus": [
            "**HU-005 (Registro de Usuario)**: Validaciones para la creación de cuentas.",
            "**HU-013 (Perfil Básico)**: Validaciones para cambios de biografía e información personal.",
            "**HU-024 (Sistema de Reviews)**: Validaciones de rango de calificaciones (ratings) y comentarios."
        ]
    },
    "app/Models": {
        "title": "Database Models (Eloquent)",
        "description": "Modelos de Eloquent ORM que representan las tablas y relaciones lógicas de la base de datos.",
        "hus": [
            "**HU-002 (Diseño de Base de Datos)**: Mapeo conceptual de tablas relacionales.",
            "**HU-005 (Registro de Usuario)**: Modelo `User` para la persistencia del perfil básico.",
            "**HU-012 (Gestión de Materias)**: Modelos `Subject` con relaciones para tutores y promedio de rating.",
            "**HU-013 (Perfil Básico)**: Definición de atributos editables de perfil."
        ]
    },
    "app/Providers": {
        "title": "Service Providers",
        "description": "Proveedores de servicios encargados del bootstrapping y configuración de los componentes de Laravel.",
        "hus": [
            "**HU-001 (Configuración Inicial)**: Registro de bindings iniciales del contenedor de servicios."
        ]
    },
    "bootstrap/cache": {
        "title": "Bootstrap Cache",
        "description": "Archivos autogenerados por Laravel para optimizar el rendimiento y configuraciones cargadas en caché.",
        "hus": [
            "No asignado directamente. Se utiliza para optimización en producción."
        ]
    },
    "config": {
        "title": "Global Config",
        "description": "Archivos de configuración del framework Laravel (base de datos, correo, autenticación, etc.).",
        "hus": [
            "**HU-003 (Configuración de Neon)**: Archivo `database.php` configurado para apuntar a PostgreSQL de Neon.",
            "**HU-006 (Inicio de Sesión)**: Archivo `auth.php` configurado para usar JWT (guard api)."
        ]
    },
    "database/factories": {
        "title": "Database Factories",
        "description": "Fábricas de datos para generar registros falsos de prueba automáticos.",
        "hus": [
            "**HU-015 (Pruebas Iniciales)**: Generación de registros mock de usuarios, materias y asesorías para testing."
        ]
    },
    "database/migrations": {
        "title": "Database Migrations",
        "description": "Esquemas de migración para la creación física y control de versiones de las tablas en la BD de Neon.",
        "hus": [
            "**HU-002 (Diseño de Base de Datos)**: Migraciones físicas para tablas (`users`, `subjects`, `universities`, `reviews`, etc.).",
            "**HU-003 (Configuración de Neon)**: Validación del despliegue del esquema de base de datos relacional."
        ]
    },
    "database/seeders": {
        "title": "Database Seeders",
        "description": "Poblamiento de tablas maestras y catálogos estáticos de la base de datos.",
        "hus": [
            "**HU-012 (Gestión de Materias)**: Carga inicial de materias predefinidas y universidades autorizadas."
        ]
    },
    "public": {
        "title": "Public Web Directory",
        "description": "Punto de entrada HTTP de la aplicación (`index.php`) y assets estáticos públicos globales.",
        "hus": [
            "**HU-001 (Configuración Inicial)**: Setup del servidor web de Laravel."
        ]
    },
    "resources/css": {
        "title": "Resource CSS Assets",
        "description": "Archivos de estilos CSS de soporte al backend (Laravel Admin o correos).",
        "hus": [
            "No aplica directamente (el front corre independiente en Vue.js)."
        ]
    },
    "resources/js": {
        "title": "Resource JS Assets",
        "description": "Archivos JavaScript de soporte al backend.",
        "hus": [
            "No aplica directamente (el front corre independiente en Vue.js)."
        ]
    },
    "resources/views": {
        "title": "Blade Template Views",
        "description": "Vistas blade del servidor (diseño de correos del sistema, errores por defecto, etc.).",
        "hus": [
            "**HU-025 (Evaluación Post-Asesoría)**: Plantilla HTML del correo enviado automáticamente al concluir una asesoría."
        ]
    },
    "routes": {
        "title": "HTTP Application Routes",
        "description": "Definición de rutas HTTP de entrada al sistema.",
        "hus": [
            "**HU-005, HU-006, HU-007, HU-011, HU-012, HU-013, HU-016, HU-017, HU-020, HU-022, HU-023, HU-024**: Declaración de endpoints en `api.php` para todas las HU requeridas en el backend."
        ]
    },
    "storage/app/public": {
        "title": "Public Storage Assets",
        "description": "Almacenamiento de archivos y documentos cargados públicamente por los usuarios.",
        "hus": [
            "**HU-022 (Convertirse en Tutor)**: Resguardo físico y seguro de documentos cargados para aprobación (ej. títulos, kardex)."
        ]
    },
    "storage/framework/cache": {
        "title": "Framework Cache",
        "description": "Datos y caché interna del framework Laravel.",
        "hus": [
            "Ninguna directamente."
        ]
    },
    "storage/framework/sessions": {
        "title": "Framework Sessions Storage",
        "description": "Sesiones basadas en archivos locales (si no se usa base de datos o Redis).",
        "hus": [
            "**HU-006 (Inicio de Sesión)**: Control del estado de login básico."
        ]
    },
    "storage/framework/views": {
        "title": "Compiled Views Cache",
        "description": "Caché de vistas Blade compiladas por Laravel.",
        "hus": [
            "Ninguna directamente."
        ]
    },
    "storage/logs": {
        "title": "Logs Storage",
        "description": "Logs de depuración y registro de incidencias del backend (`laravel.log`).",
        "hus": [
            "**HU-006, HU-015**: Auditoría de errores de login y logs de excepciones generales en testeo."
        ]
    },
    "tests/Feature": {
        "title": "Feature Integration Tests",
        "description": "Pruebas funcionales y de integración que validan endpoints del backend completos de extremo a extremo.",
        "hus": [
            "**HU-015 (Pruebas Iniciales)**: Suite de pruebas automatizadas para registro, login, universidades y materias."
        ]
    },
    "tests/Unit": {
        "title": "Unit Tests",
        "description": "Pruebas unitarias sobre helpers, wrappers y lógica puramente aislada del backend.",
        "hus": [
            "**HU-015 (Pruebas Iniciales)**: Suite de pruebas unitarias sobre middleware de roles o helpers de email."
        ]
    }
}

# Define the README layouts and descriptions for each frontend folder
frontend_readmes = {
    "public": {
        "title": "Static Assets Directory",
        "description": "Archivos estáticos indexados directamente en la raíz (ej. favicon.ico, robots.txt).",
        "hus": [
            "**HU-001 (Configuración Inicial del Proyecto)**: Setup de archivos base públicos de Vite."
        ]
    },
    "src/assets": {
        "title": "Assets Folder",
        "description": "Imágenes locales, iconos vectoriales y logotipos importados en componentes de Vue.",
        "hus": [
            "**HU-009 (Integración de Diseño v0)**: Resguardo de elementos visuales estáticos integrados al diseño."
        ]
    },
    "src/components/common": {
        "title": "Reusable UI Components",
        "description": "Componentes genéricos de interfaz (Botones, Inputs, Modales de Confirmación, Cargas / Spinners).",
        "hus": [
            "**HU-009 (Integración de Diseño v0)**: Creación e integración de componentes UI reutilizables con estilos unificados."
        ]
    },
    "src/components/layout": {
        "title": "Layout Components",
        "description": "Componentes de estructura y navegación principal (`Navbar.vue`, `Sidebar.vue`, `Footer.vue`).",
        "hus": [
            "**HU-010 (Navegación de la Aplicación)**: Definición del layout envolvente y menús responsivos."
        ]
    },
    "src/composables": {
        "title": "Vue Composables",
        "description": "Composition API reutilizables para encapsular lógica de estado y validaciones.",
        "hus": [
            "**HU-005, HU-006**: Validación en cliente de formularios de registro y login (ej: `useFormValidation`)."
        ]
    },
    "src/router": {
        "title": "Application Router",
        "description": "Gestión de rutas mediante Vue Router.",
        "hus": [
            "**HU-010 (Navegación)**: Definición de rutas públicas, rutas privadas (protegidas) y Guards de redirección."
        ]
    },
    "src/stores": {
        "title": "Global State (Pinia)",
        "description": "Almacenes globales de datos estructurados con Pinia.",
        "hus": [
            "**HU-007 (Persistencia de Sesión)**: Pinia `authStore` para control de token JWT, caducidad del token e información del usuario actual."
        ]
    },
    "src/views/auth": {
        "title": "Auth Views",
        "description": "Vistas de acceso al sistema.",
        "hus": [
            "**HU-005 (Registro de Usuario)**: Pantalla de registro de estudiantes y tutores.",
            "**HU-006 (Inicio de Sesión)**: Pantalla de login de usuarios."
        ]
    },
    "src/views/home": {
        "title": "Home Views",
        "description": "Vistas de página de inicio de la aplicación y dashboards.",
        "hus": [
            "**HU-012 (Materias en Home)**: Vista principal del catálogo de materias destacadas.",
            "**HU-018 (Home Dashboard Avanzado)**: Visualización avanzada de tutores destacados e invitaciones a asesoría."
        ]
    },
    "src/views/profile": {
        "title": "User Profile Views",
        "description": "Vistas para la autogestión de perfil.",
        "hus": [
            "**HU-013 (Perfil Básico de Usuario)**: Vista para editar información personal, bio y foto.",
            "**HU-023 (Gestión de Logros Académicos)**: Formulario CRUD para agregar o borrar logros académicos."
        ]
    },
    "src/views/subjects": {
        "title": "Subject Views",
        "description": "Vistas relacionadas a los temarios y listado de materias.",
        "hus": [
            "**HU-019 (Detalle de Materias)**: Vista del temario, estadísticas generales y tutores de la materia."
        ]
    },
    "src/views/tutors": {
        "title": "Tutors Module Views",
        "description": "Vistas y flujos relacionados a la visualización y postulación de tutores.",
        "hus": [
            "**HU-016 (Búsqueda de Tutores)**: Vista del buscador de tutores y filtros de búsqueda.",
            "**HU-017 (Perfil Público de Tutor)**: Vista del perfil detallado de cada tutor.",
            "**HU-021 (Conversación desde Perfil)**: Redirección al chat interactivo tras presionar el botón de mensaje.",
            "**HU-022 (Convertirse en Tutor)**: Formulario para postularse como tutor y subir documentos necesarios.",
            "**HU-024 (Sistema de Reviews)**: Vista o sección del listado de valoraciones del tutor."
        ]
    },
    "src/services": {
        "title": "API Consumer Services",
        "description": "Clases cliente (e.g. Axios) para interactuar con los endpoints del backend.",
        "hus": [
            "**HU-005, HU-006, HU-007 (Auth Services)**: Conexión a login, registro y `/auth/me`.",
            "**HU-011 (University Service)**: Consumo de GET `/universities`.",
            "**HU-012 (Subject Service)**: Consumo de GET `/subjects`.",
            "**HU-016, HU-017 (Tutor Service)**: Obtención de búsquedas y perfiles de tutores."
        ]
    },
    "src/utils": {
        "title": "Utils & Helpers",
        "description": "Funciones globales de soporte, regex y parseadores.",
        "hus": [
            "**HU-005 (Registro)**: Función para validar el dominio de correo institucional autorizado por universidad."
        ]
    },
    "src/styles": {
        "title": "Global Styles CSS",
        "description": "Hojas de estilo CSS globales, reset y variables del tema visual (colores, fuentes).",
        "hus": [
            "**HU-009 (Integración de Diseño v0)**: Estructura estética base e implantación del diseño visual."
        ]
    }
}


def write_readme_file(folder_path, data):
    # Prepare content
    lines = [
        f"# 📂 {data['title']}",
        "",
        data['description'],
        "",
        "## 📋 Historias de Usuario (HU) Asociadas:",
        ""
    ]
    for hu in data['hus']:
        lines.append(f"- {hu}")
    lines.append("")
    
    file_content = "\n".join(lines)
    readme_path = os.path.join(folder_path, "README.md")
    
    # Create directory if it doesn't exist
    os.makedirs(folder_path, exist_ok=True)
    
    # Write to README.md
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(file_content)
    print(f"[INFO] Generado: {readme_path}")


def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    print(f"Generando archivos README.md en monorepo: {base_dir}")
    
    # 1. Backend folder readmes
    for rel_path, data in backend_readmes.items():
        folder_path = os.path.join(base_dir, "backend", rel_path)
        write_readme_file(folder_path, data)
        
    # 2. Frontend folder readmes
    for rel_path, data in frontend_readmes.items():
        folder_path = os.path.join(base_dir, "frontend", rel_path)
        write_readme_file(folder_path, data)
        
    print("\n[ÉXITO] Todos los READMEs se han generado correctamente.")

if __name__ == "__main__":
    main()
