# 🖥️ Backend - PHP Laravel (TutorMX)

Este directorio contiene la API REST y lógica de negocio construida con **PHP Laravel**. A continuación se detalla el propósito de cada carpeta y la asignación de las Historias de Usuario (HU) definidas para el proyecto.

## 📁 Propósito de Carpetas y Asignación de HUs

### 1. `app/`
Directorio principal con el código fuente de la lógica de negocio de la aplicación.
* **`Console/`**: Tareas programadas por consola y cronjobs.
  * *HUs Asignadas*: **HU-025 (Evaluación Post-Asesoría)** — Automatización del envío de notificaciones/correos post-asesoría.
* **`Exceptions/`**: Manejador global de excepciones del sistema.
  * *HUs Asignadas*: **HU-006 (Inicio de Sesión)** — Formateo y retorno estructurado de errores de credenciales y validaciones.
* **`Http/`**: Capa de entrada y transporte HTTP:
  * **`Controllers/`**: Controladores que atienden las peticiones REST.
    * `AuthController.php`: **HU-005 (Registro de Usuario)** y **HU-006 (Inicio de Sesión)** y **HU-007 (Persistencia de Sesión)**.
    * `UniversityController.php`: **HU-011 (Gestión de Universidades)**.
    * `SubjectController.php`: **HU-012 (Gestión de Materias)**.
    * `ProfileController.php`: **HU-013 (Perfil Básico)**.
    * `TutorController.php`: **HU-016 (Búsqueda)**, **HU-017 (Perfil Tutor)**.
    * `MessageController.php`: **HU-020 (Mensajería)**.
    * `TutorRequestController.php`: **HU-022 (Convertirse en Tutor)**.
    * `AchievementController.php`: **HU-023 (Logros Académicos)**.
    * `ReviewController.php`: **HU-024 (Sistema de Reviews)**.
  * **`Middleware/`**: Filtros de peticiones HTTP.
    * `JwtMiddleware.php`: **HU-007 (Persistencia de Sesión)** — Validación y descifrado de tokens JWT de sesión.
    * `RoleMiddleware.php`: **HU-014 (Preparación de Roles)** — Autorización basada en roles base (`USER`, `TUTOR`, `ADMIN`).
  * **`Requests/`**: Clases de validación de peticiones (Form Requests).
    * *HUs Asignadas*: **HU-005, HU-013, HU-024** — Validaciones robustas de entrada de datos.
* **`Models/`**: Clases de modelo relacional (Eloquent ORM).
  * *HUs Asignadas*: **HU-002 (Diseño BD)** y **HU-005 (Registro)** — Modelado de `User`, `Subject`, `University`, `Review`, `Conversation`, `Message`, `Achievement`, `TutorAvailability` y `TutoringSession`.
* **`Providers/`**: Inicializadores y registros del ciclo de vida de Laravel.

### 2. `config/`
Configuración global de servicios del framework (auth, database, mail, app, etc.).
* *HUs Asignadas*: **HU-006 (JWT Auth Setup)** y **HU-003 (Neon Postgres Setup)**.

### 3. `database/`
Archivos relacionados con el esquema de base de datos relacional.
* **`migrations/`**: Definición física e incremental de tablas.
  * *HUs Asignadas*: **HU-002 (Diseño BD)** y **HU-003 (Configuración Neon)** — Creación de tablas, constraints, llaves foráneas e índices.
* **`seeders/`**: Poblamiento de tablas maestras.
  * *HUs Asignadas*: **HU-012 (Gestión de Materias)** — Llenado inicial (seed) de materias predeterminadas y universidades.
* **`factories/`**: Generadores de modelos de prueba simulados.

### 4. `routes/`
Definición de rutas HTTP de entrada al sistema.
* **`api.php`**: Endpoints de la API RESTful consumida por el frontend en Vue.js.
  * `POST /auth/register` (HU-005)
  * `POST /auth/login` (HU-006)
  * `GET /auth/me` (HU-007)
  * `GET /universities` (HU-011)
  * `GET /subjects` (HU-012)
  * `PATCH /profile` (HU-013)
  * `GET /tutors` (HU-016)
  * `GET /tutors/{id}` (HU-017)
  * `GET/POST /conversations` (HU-020, HU-021)
  * `POST /tutor-requests` (HU-022)
  * `CRUD /achievements` (HU-023)
  * `POST /reviews` (HU-024)

### 5. `storage/`
Archivos temporales, subida de documentos y logs del servidor.
* *HUs Asignadas*: **HU-022 (Convertirse en Tutor)** — Almacenamiento seguro de documentos académicos cargados (`storage/app/public`).

### 6. `tests/`
* **`Feature/`**: Pruebas funcionales e integración de flujos de endpoints.
* **`Unit/`**: Pruebas unitarias aisladas de lógica de negocio y helpers.
  * *HUs Asignadas*: **HU-015 (Pruebas Iniciales)**.

---

## 🛠️ Requisitos de Desarrollo
1. Contar con PHP >= 8.2 y Composer.
2. Configurar el archivo `.env` en la raíz de esta carpeta con el `DATABASE_URL` correspondiente de Neon.
