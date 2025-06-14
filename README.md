TaskPlanner es una aplicación web de planificación de tareas y eventos que permite a los usuarios registrarse, iniciar sesión, gestionar sus tareas y recibir correos electrónicos de confirmación.

## Características
- Registro e inicio de sesión con autenticación JWT
- CRUD completo de tareas
- Rutas protegidas para usuarios autenticados
- Conexión a base de datos MongoDB
- Contraseñas encriptadas con bcrypt
- Envío de correos electrónicos con Nodemailer
- Frontend conectado al backend mediante fetch
- Almacenamiento del token en localStorage

## Tecnologías utilizadas
### Frontend
- HTML, CSS, JavaScript
### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- Nodemailer para envío de correos