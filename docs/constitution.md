# Constitución del Proyecto: CEA Conductores La Unión

## 1. Arquitectura General
- Sistema cliente-servidor desacoplado (Frontend: `proyecto_web-Launion/frontend`, Backend: `proyecto_web-Launion/backend`).
- Metodología ágil con enfoque en MVP.

## 2. Stack Tecnológico (Frontend)
- Angular 17+ (Standalone Components estrictos, prohibido NgModules).
- UI: Bootstrap 5, Animate.css.
- Paleta: Verde Lima (#8CC63F), Gris Oscuro (#333333).
- Enrutamiento con Lazy Loading (`loadComponent`).
- Inyección de dependencias con `inject()`.

## 3. Stack Tecnológico (Backend)
- Node.js + Express.
- Patrón MVC estricto.
- Base de Datos: MongoDB Atlas + Mongoose.
- Seguridad: bcrypt (encriptación), JWT (sesiones), RBAC (middlewares).
- Roles: Administrador, Gerente, Auxiliar (Atención, Teoría, Práctica).

## 4. Reglas de Negocio Clave
- **Formulario Público:** Captura nombre, teléfono, correo y curso. Se guarda en la colección `solicitudes`.
- **Login ("KYBER"):** Redirección dinámica según rol. Rutas del Dashboard protegidas por AuthGuard y RoleGuard.
- **Chatbot:** Lógica local basada en reglas y palabras clave. NO usar APIs externas de IA para evitar costos.
- **Sedes:** Pasto, Ipiales y La Unión (con mapas).

## 5. Convenciones
- Código técnico en inglés. UI y entidades de negocio en español.
- Respuestas de API en JSON estandarizado.