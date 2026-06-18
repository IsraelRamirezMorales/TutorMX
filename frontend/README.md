# 🎨 Frontend - Vue.js 3 & Vite (TutorMX)

Este directorio alberga el código del cliente web construido con **Vue.js 3 (Composition API)**, **Vite** como empaquetador y **Pinia** para el estado global. A continuación se describe la estructura del frontend y su relación con las Historias de Usuario (HU).

## 📁 Propósito de Carpetas y Asignación de HUs

### 1. `src/`

#### **`views/`** (Vistas y Pantallas Principales)
Organizadas por dominios y módulos funcionales:
* **`auth/`** (Módulo de Autenticación):
  * `Register.vue`: **HU-005 (Registro de Usuario)** — Formulario de registro con filtros de correos institucionales y asociación a universidad principal (HU-011).
  * `Login.vue`: **HU-006 (Inicio de Sesión)** — Formulario de login y manejo de credenciales.
* **`home/`** (Módulo del Panel Principal):
  * `Home.vue`: **HU-012 (Materias en Home)** y **HU-018 (Home Avanzado)** — Panel con grid de materias predeterminadas, listado de tutores destacados e integración del rating general.
* **`profile/`** (Módulo de Perfil):
  * `Profile.vue`: **HU-013 (Perfil Básico)** y **HU-023 (Logros Académicos)** — Formulario de datos personales, edición de biografía, foto y CRUD para los logros académicos del usuario.
* **`subjects/`** (Módulo de Materias):
  * `SubjectDetail.vue`: **HU-019 (Detalle de Materias)** — Vista o modal que lista el temario general de la materia seleccionada y sus tutores destacados asociados.
* **`tutors/`** (Módulo de Tutores):
  * `TutorSearch.vue`: **HU-016 (Búsqueda de Tutores)** — Filtros avanzados por materia, nombre, universidad, disponibilidad y rating.
  * `TutorProfile.vue`: **HU-017 (Perfil del Tutor)** y **HU-021 (Mensaje desde Perfil)** — Detalle público del tutor con estadísticas, materias, calificaciones e inicio/redirección de mensajería directa (HU-020).
  * `ApplyTutor.vue`: **HU-022 (Convertirse en Tutor)** — Interfaz para subir documentos académicos y dar seguimiento al estado de aprobación.
  * `TutorReviews.vue`: **HU-024 / HU-025 (Reseñas)** — Formulario y visualización de testimonios / valoraciones posteriores a la asesoría.

#### **`components/`** (Componentes Reutilizables)
* **`common/`**: Botones, selects, modales, input tags, spinners y cards genéricos.
  * *HUs Asignadas*: **HU-009 (Integración de Diseño)**.
* **`layout/`**: Componentes estructurales de la página como `Navbar.vue`, `Sidebar.vue` y `Footer.vue`.
  * *HUs Asignadas*: **HU-010 (Navegación de la Aplicación)** — Definición del Layout principal y responsive web design.

#### **`router/`** (Gestión de Navegación)
* **`index.js`**: Configuración de rutas usando *Vue Router*.
  * *HUs Asignadas*: **HU-010 (Navegación)** — Declaración de rutas públicas, rutas privadas (protegidas por token) y guards de redirección según el estado de autenticación.

#### **`stores/`** (Gestión de Estado Global - Pinia)
* **`auth.js`**: Estado global del usuario de la sesión actual.
  * *HUs Asignadas*: **HU-007 (Persistencia de Sesión)** — Almacenamiento local del token JWT, verificación de validez (endpoint `/me` de backend) y proceso de logout.

#### **`services/`** (Capa Cliente de Consumo de API REST)
Interactúan con los endpoints del backend utilizando Axios o Fetch:
* `auth.service.js`: **HU-005, HU-006, HU-007** (Registro, Login, Sesión).
* `university.service.js`: **HU-011** (GET `/universities` para selectores).
* `subject.service.js`: **HU-012** (GET `/subjects` para home).
* `tutor.service.js`: **HU-016, HU-017** (Búsqueda y Perfil).
* `message.service.js`: **HU-020** (Mensajería).

#### **`composables/`**
Composables de Vue 3 para encapsular lógica lógica de interfaz reutilizable (e.g. `useAuth`, `useFormValidation`).

#### **`styles/`** & **`assets/`**
Estilos CSS, tipografía, logotipos e iconos de la aplicación.
* *HUs Asignadas*: **HU-009 (Diseño v0)**.

---

## 🛠️ Requisitos de Desarrollo
1. Contar con Node.js v20+.
2. Instalar dependencias mediante `npm install` en esta carpeta.
3. Ejecutar en modo desarrollo local con:
   ```bash
   npm run dev
   ```
