# 📂 HTTP Controllers

Controladores HTTP que manejan las solicitudes REST provenientes del frontend.

## 📋 Historias de Usuario (HU) Asociadas:

- **HU-005 (Registro de Usuario)**: `AuthController` para registro de usuarios y validaciones básicas.
- **HU-006 (Inicio de Sesión)**: `AuthController` para validación de credenciales y generación de JWT.
- **HU-007 (Persistencia de Sesión)**: Endpoint `/auth/me` para recuperar usuario autenticado y logout.
- **HU-011 (Gestión de Universidades)**: `UniversityController` con endpoint GET `/universities`.
- **HU-012 (Gestión de Materias)**: `SubjectController` con endpoint GET `/subjects`.
- **HU-013 (Perfil Básico de Usuario)**: `ProfileController` para actualización de datos y fotos.
- **HU-016 (Búsqueda de Tutores)**: `TutorController` para filtros de búsqueda de tutores.
- **HU-017 (Perfil Público de Tutor)**: `TutorController` para datos públicos y estadísticas del tutor.
- **HU-020 (Mensajería)**: `MessageController` para listado de conversaciones y envío de mensajes.
- **HU-022 (Convertirse en Tutor)**: `TutorRequestController` para procesar postulaciones de tutores.
- **HU-023 (Gestión de Logros Académicos)**: `AchievementController` para CRUD de logros.
- **HU-024 (Sistema de Reviews)**: `ReviewController` para registrar evaluaciones de tutores.
