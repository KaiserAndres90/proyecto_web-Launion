# MEMORY.md - Contexto Persistente del Proyecto

## Decisiones Arquitectónicas
- **Monorepo:** Carpetas separadas para `frontend` (Angular) y `backend` (Node).
- **Autenticación:** Login nombrado "KYBER". Se usará JWT con expiración de 2 horas y bcrypt para encriptación.
- **Chatbot:** Lógica 100% local basada en arrays de `keywords` y `response` (cero costos de API externa).
- **Base de Datos:** MongoDB Atlas, base de datos NoSQL con ODM Mongoose.

## Entidades Principales
- **Usuario:** nombre, email, password, rol (Administrador, Gerente, Auxiliar).
- **Solicitud:** nombre, telefono, correo, curso, estado (Pendiente, Contactado).