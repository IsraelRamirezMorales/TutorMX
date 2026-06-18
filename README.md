# TutorMX 🎓

**TutorMX** (INTRU-HUB) es una plataforma web integral y responsiva diseñada para conectar a estudiantes universitarios con tutores académicos en tiempo real. El sistema permite descubrir materias, realizar búsquedas avanzadas de asesores, coordinar tutorías y fomentar la retroalimentación y reputación académica dentro de comunidades universitarias.

El proyecto está estructurado como un **monorepositorio dockerizado**, separando la API REST (Backend en Laravel) y la interfaz SPA (Frontend en Vue.js 3).

---

## 🚀 Arquitectura y Tecnologías

El sistema implementa una arquitectura moderna de software con desacoplamiento total:

* **Backend**: Construido con **PHP Laravel**, exponiendo una API REST robusta, utilizando Eloquent ORM para la interacción de datos y validaciones avanzadas en solicitudes HTTP.
* **Frontend**: SPA reactiva construida con **Vue.js 3 (Composition API)**, utilizando **Vite** para la compilación rápida y **Pinia** para la gestión centralizada del estado de sesión.
* **Base de Datos**: PostgreSQL alojada de forma serverless en **Neon**, garantizando alta disponibilidad, escalabilidad y conexiones SSL seguras.
* **Contenerización**: Orquestación completa mediante **Docker y Docker Compose**, permitiendo un entorno homogéneo y portable de desarrollo con soporte para *Hot-Reload* (recarga en caliente).

---

## 🗺️ Roadmap del Proyecto y Sprints

El desarrollo de la plataforma se divide en tres fases incrementales bien definidas:

### 📅 Sprint 1: Bases Técnicas y Autenticación
**Objetivo:** Construir la infraestructura base, configurar la base de datos relacional y desarrollar el flujo completo de autenticación y consulta inicial.
* **Estructura del Proyecto:** Configuración del repositorio, Docker Compose, Git Flow, dependencias iniciales y andamiaje de Laravel y Vue 3.
* **Base de Datos & Neon:** Diseño de tablas relacionales, llaves primarias/foráneas, índices de búsqueda y migraciones iniciales a Neon.
* **Autenticación Completa (JWT):**
  * Registro de usuarios con validación obligatoria de correo institucional (filtrado por dominio universitario).
  * Inicio de sesión seguro con generación de Tokens JWT y manejo centralizado de errores.
  * Middleware JWT para validación y persistencia de sesión activa (endpoint `/me` e interfaz local).
* **Gestión de Universidades y Materias:** Catálogo interactivo de materias y universidades, desplegando tarjetas de materias destacadas en el Home con promedio de ratings y contadores.
* **Perfil de Usuario:** Actualización de información básica, biografía y carga de foto de perfil.
* **Calidad:** Pruebas unitarias e integración de flujos principales.

---

### 📅 Sprint 2: Búsqueda y Descubrimiento
**Objetivo:** Implementar la búsqueda avanzada de asesores y los perfiles públicos detallados para completar la experiencia de descubrimiento.
* **Búsqueda Avanzada de Tutores:** Filtros interactivos de búsqueda en tiempo real por nombre de tutor, materias impartidas, áreas de especialidad, universidad de origen y disponibilidad horaria.
* **Perfil Público de Tutor:** Panel detallado con información profesional, historial de materias del tutor, biografía, calificaciones promedio obtenidas y estadísticas de desempeño.
* **Detalle de Materias:** Vista expandible que despliega el temario oficial de la materia y el listado de tutores destacados que la imparten.
* **Dashboard Avanzado:** Integración de rankings, destacando a los tutores recomendados y mejor valorados en el Home.

---

### 📅 Sprint 3: Interacción, Reputación y Validación
**Objetivo:** Desarrollar las herramientas de comunicación, gestión de reputación y el flujo administrativo para la postulación de tutores.
* **Mensajería en Tiempo Real:** Canal de comunicación integrado que permite conversaciones directas y persistentes entre estudiantes y tutores (creación automática de chats desde el perfil).
* **Postulación de Tutores:** Flujo para que un usuario convencional solicite convertirse en tutor, incluyendo la carga digital de certificados y documentos para su revisión y aprobación por parte del administrador.
* **Gestión de Logros Académicos:** CRUD para que los tutores agreguen reconocimientos y certificaciones a sus perfiles públicos.
* **Evaluación y Reviews:** Sistema de retroalimentación donde el estudiante califica el desempeño del tutor con escala de estrellas (ratings) y comentarios tras finalizar cada asesoría.
* **Flujo Post-Asesoría:** Automatización del envío de notificaciones de evaluación al concluir las sesiones para actualizar dinámicamente la reputación del tutor.

---
**Desarrolladores del Proyecto:** Israel Ramírez Morales & Gabriel Chacón Arellano.