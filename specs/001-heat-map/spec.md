# Especificación: Módulo de Solicitudes y Mapa de Calor

## Descripción
El sistema debe capturar solicitudes de información desde el frontend público y mostrarlas en un dashboard administrativo. El "Heat Map" se refiere a la visualización de la tabla de solicitudes.

## Requisitos Backend
- Endpoint `POST /api/solicitudes` (Público).
- Endpoint `GET /api/solicitudes` (Protegido, roles Admin/Gerente).
- Modelo Mongoose: nombre, telefono, correo, curso, estado (default 'Pendiente').

## Requisitos Frontend
- Componente `ContactoComponent` con formulario reactivo.
- Componente `DashboardComponent` con tabla Bootstrap para listar solicitudes.