# Informe técnico de avance: Backend del CEA Conductores La Unión

**Fecha:** 24 de octubre de 2026  
**Fase:** Desarrollo del backend e integración pendiente con el frontend

## 1. Resumen ejecutivo

Se implementó una API REST para el CEA Conductores La Unión con Node.js, Express y MongoDB mediante Mongoose. El backend incluye persistencia de solicitudes de preinscripción y contacto, autenticación de usuarios con contraseñas protegidas mediante bcrypt y autorización basada en JWT y roles. Además de las funciones inicialmente previstas, están disponibles endpoints para consultar y administrar cursos, horarios, servicios y novedades. Se añadieron validación de entradas, manejo centralizado de errores y configuración para servir archivos; la conexión desde Angular y las pruebas integrales entre ambas aplicaciones siguen pendientes.

## 2. Arquitectura y tecnologías utilizadas

- **Node.js y módulos ES:** entorno de ejecución y formato de módulos del backend.
- **Express 5:** servidor HTTP, middleware y definición de rutas REST.
- **MongoDB y Mongoose:** persistencia documental, esquemas, validaciones, relaciones mediante referencias e índices.
- **Arquitectura MVC:** modelos de datos, controladores con lógica de negocio y rutas que exponen las operaciones.
- **dotenv:** carga de parámetros de configuración desde el entorno.
- **bcryptjs:** generación y comparación de hashes de contraseñas.
- **jsonwebtoken (JWT):** creación y verificación de tokens de autenticación.
- **express-validator:** validación y normalización de datos recibidos por la API.
- **Helmet:** cabeceras HTTP de seguridad.
- **CORS:** habilitación de solicitudes de origen cruzado.
- **Morgan:** registro de solicitudes HTTP en modo desarrollo.
- **Multer:** middleware preparado para carga de archivos; actualmente no está conectado a rutas de la API.

La aplicación carga variables como `PORT`, `DATABASE`, `JWT_SECRET` y `JWT_EXPIRES_IN`. El servidor valida el puerto, espera la conexión a MongoDB antes de escuchar solicitudes y gestiona el cierre del servidor y de la conexión a la base de datos.

### Organización principal

- `src/models/`: esquemas Mongoose.
- `src/controllers/`: lógica de las operaciones de cada recurso.
- `src/routes/`: definición de rutas y validaciones de entrada.
- `src/middlewares/`: autenticación, autorización por rol, validación y manejo de errores.
- `src/config/`: conexión a MongoDB y carga de datos de desarrollo.
- `src/utils/`: generación de JWT y utilidades de respuesta.

## 3. Detalle de modelos de datos

Los esquemas incluyen marcas de tiempo (`createdAt` y `updatedAt`) cuando se configuraron con `timestamps`.

### Solicitud

Registra contactos y preinscripciones:

- `tipo`: `preinscripcion` o `contacto`; por defecto, `preinscripcion`.
- `nombre`: obligatorio, texto recortado, máximo 150 caracteres.
- `email`: obligatorio, normalizado a minúsculas y validado como correo.
- `telefono`: obligatorio, validado con formato y longitud de 7 a 15 caracteres permitidos.
- `cursoInteres`: referencia a un curso; obligatorio para preinscripciones.
- `mensaje`: opcional, máximo 3.000 caracteres.
- `estado`: `Recibida`, `En revisión`, `Aprobada` o `Rechazada`; por defecto, `Recibida`.
- `observaciones`: opcional, máximo 3.000 caracteres, para seguimiento interno.

Tiene índices por estado y fecha de creación, y por correo y fecha de creación.

### Usuario

Representa a quienes acceden al panel administrativo:

- `nombre`, `email` y `telefono`: datos de identificación; el correo es único y se normaliza a minúsculas.
- `password`: obligatorio, mínimo de seis caracteres y excluido de las consultas por defecto. Un middleware de Mongoose lo transforma en un hash bcrypt antes de guardar; no se conserva en texto plano.
- `rol`: `admin`, `gerente` o `auxiliar`; el valor por defecto es `auxiliar`.
- `activo`: permite deshabilitar una cuenta sin borrarla.
- `ultimoAcceso`: fecha del último inicio de sesión satisfactorio.
- `resetPasswordToken` y `resetPasswordExpire`: campos no seleccionados por defecto, previstos para tokens temporales de restablecimiento.

El modelo implementa comparación de contraseñas y generación/hasheo de token de restablecimiento. No hay endpoints de recuperación de contraseña expuestos actualmente.

### Otros modelos disponibles

- **Curso:** nombre, descripción, categoría, duración, precio, requisitos, imagen y estado activo. La categoría determina automáticamente el tipo de servicio, su descripción y la edad mínima. Incluye índices por categoría y tipo de servicio.
- **Horario:** curso e instructor referenciados, días, horas de inicio y fin, cupos máximos y ocupados, estado activo y cupos disponibles calculados. Valida el orden de las horas y que los cupos ocupados no excedan el máximo.
- **Servicio:** nombre, descripción, precio, descuentos con porcentaje y fechas, y estado activo. Valida rangos y periodos de descuento.
- **Novedad:** título, contenido, imagen, autor referenciado y estado de publicación.

## 4. Catálogo de endpoints implementados

La aplicación registra sus rutas bajo el prefijo **`/api/v1`**. Por tanto, las rutas efectivas están versionadas; por ejemplo, el endpoint de autenticación es `/api/v1/auth/login` y no `/api/auth/login`.

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Registra una cuenta y emite un JWT. El registro asigna el rol `auxiliar`; no admite asignar roles privilegiados desde el cuerpo de la solicitud. | Público |
| `POST` | `/api/v1/auth/login` | Valida correo, contraseña y estado activo; actualiza el último acceso y emite un JWT. | Público |
| `GET` | `/api/v1/auth/me` | Devuelve el perfil del usuario autenticado. | Privado: JWT Bearer |
| `POST` | `/api/v1/solicitudes` | Recibe una solicitud de contacto o preinscripción. | Público |
| `GET` | `/api/v1/solicitudes` | Lista solicitudes; permite filtrar por `estado` y `email`. | Privado: admin, gerente o auxiliar |
| `GET` | `/api/v1/solicitudes/:id` | Obtiene el detalle de una solicitud. | Privado: admin, gerente o auxiliar |
| `PUT` | `/api/v1/solicitudes/:id/estado` | Actualiza el estado y, opcionalmente, las observaciones de seguimiento. | Privado: admin o auxiliar |
| `GET` | `/api/v1/cursos` | Lista cursos activos. | Público |
| `GET` | `/api/v1/cursos/:id` | Obtiene un curso activo. | Público |
| `POST` | `/api/v1/cursos` | Crea un curso. | Privado: admin o auxiliar |
| `PUT` | `/api/v1/cursos/:id` | Actualiza un curso. | Privado: admin o auxiliar |
| `DELETE` | `/api/v1/cursos/:id` | Elimina un curso. | Privado: admin o auxiliar |
| `GET` | `/api/v1/horarios` | Lista horarios activos con información del curso e instructor. | Público |
| `GET` | `/api/v1/horarios/:id` | Obtiene un horario activo. | Público |
| `POST` | `/api/v1/horarios` | Crea un horario. | Privado: admin o auxiliar |
| `PUT` | `/api/v1/horarios/:id` | Actualiza un horario. | Privado: admin o auxiliar |
| `DELETE` | `/api/v1/horarios/:id` | Elimina un horario. | Privado: admin o auxiliar |
| `GET` | `/api/v1/servicios` | Lista servicios activos. | Público |
| `GET` | `/api/v1/servicios/:id` | Obtiene un servicio activo. | Público |
| `POST` | `/api/v1/servicios` | Crea un servicio. | Privado: admin o auxiliar |
| `PUT` | `/api/v1/servicios/:id` | Actualiza un servicio. | Privado: admin o auxiliar |
| `DELETE` | `/api/v1/servicios/:id` | Elimina un servicio. | Privado: admin o auxiliar |
| `GET` | `/api/v1/novedades` | Lista novedades publicadas. | Público |
| `GET` | `/api/v1/novedades/:id` | Obtiene una novedad publicada. | Público |
| `POST` | `/api/v1/novedades` | Crea una novedad y asocia como autor al usuario autenticado. | Privado: admin o auxiliar |
| `PUT` | `/api/v1/novedades/:id` | Actualiza una novedad. | Privado: admin o auxiliar |
| `DELETE` | `/api/v1/novedades/:id` | Elimina una novedad. | Privado: admin o auxiliar |

Las rutas privadas requieren `Authorization: Bearer <token>`. Los endpoints de lectura pública de cursos, horarios, servicios y novedades solo devuelven registros activos o publicados, según corresponda. Las rutas validan identificadores y campos de entrada; las respuestas siguen un formato JSON con indicador de éxito, mensaje y/o datos.

## 5. Medidas de seguridad aplicadas

- **Hash de contraseñas:** bcryptjs con salt de 10 rondas antes del guardado; la comparación del login usa bcrypt.
- **JWT:** el inicio de sesión emite tokens firmados con `JWT_SECRET` y expiración configurada por `JWT_EXPIRES_IN` (un día por defecto). Los endpoints protegidos verifican la firma, la expiración y el estado activo de la cuenta.
- **Control de acceso por roles:** middleware separado para restringir operaciones según `admin`, `gerente` o `auxiliar`.
- **Protección de campos sensibles:** las consultas omiten por defecto la contraseña y los campos de restablecimiento; el controlador de autenticación los excluye de las respuestas.
- **Validación de entradas:** validación de tipos, longitudes, formatos, identificadores MongoDB y valores enumerados.
- **Cabeceras HTTP:** Helmet habilitado.
- **CORS:** middleware habilitado globalmente. La configuración actual usa los valores predeterminados de `cors`, sin restricción explícita de origen; debe limitarse a los dominios de despliegue antes de producción.
- **Manejo de errores:** respuestas centralizadas para errores de validación, identificadores, duplicados, JWT y carga de archivos.
- **Límite de cuerpo:** JSON y formularios URL-encoded limitados a 10 MB.
- **Carga de archivos preparada:** Multer permite PDF y JPG, hasta 5 MB por archivo y cinco archivos por solicitud, con nombres aleatorios; no se identificaron rutas que lo utilicen.

## 6. Próximos pasos

1. **Definir la URL base y el contrato de integración** entre Angular y la API, incluyendo la versión `/api/v1`, los cuerpos de solicitud y el formato uniforme de respuesta.
2. **Configurar Angular para consumir la API:** crear servicios con `HttpClient`, establecer la URL por ambiente y conectar el formulario a `POST /api/v1/solicitudes`.
3. **Conectar el panel administrativo:** consumir el login, almacenar el token siguiendo una estrategia segura, añadir un interceptor Bearer y proteger las vistas administrativas; integrar los listados y la actualización de estado de solicitudes.
4. **Verificar compatibilidad de datos:** comprobar que el formulario envíe `tipo`, `cursoInteres` como ID válido de MongoDB y los demás campos en los formatos requeridos.
5. **Restringir CORS** a los orígenes de Angular correspondientes a desarrollo y producción.
6. **Preparar la configuración de despliegue:** definir `DATABASE`, un `JWT_SECRET` fuerte, expiración de token y variables por ambiente; no versionar secretos.
7. **Revisar el alta inicial de usuarios:** `/api/v1/auth/register` es público, aunque crea únicamente usuarios `auxiliar`. Definir un proceso controlado para el primer administrador y decidir si el registro debe cerrarse o restringirse en producción.
8. **Asegurar el uso del seeder:** el script de datos de ejemplo elimina los registros existentes de usuarios y cursos antes de insertarlos. Debe reservarse para desarrollo y nunca ejecutarse contra una base de datos productiva.
9. **Completar pruebas:** probar endpoints públicos y privados, roles, validaciones, errores, persistencia MongoDB y flujos Angular-backend; documentar el contrato para el equipo frontend.
10. **Evaluar controles de producción pendientes:** limitación de intentos de login, política de contraseñas, flujo real de recuperación de contraseña y registro/monitorización de eventos de autenticación.

**Alcance del avance:** la API backend está implementada y expone los recursos descritos. En la revisión del frontend no se detectó consumo de estos endpoints, por lo que la conexión funcional entre Angular y el backend aún debe completarse y verificarse.
