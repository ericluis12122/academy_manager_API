
# Diagrama de Componentes del Sistema

## Descripción General

El sistema está diseñado para proporcionar una plataforma completa para alumnos que estudian oposiciones. Se compone de varios componentes que interactúan entre sí para ofrecer funcionalidades como el estudio de preguntas, realización de exámenes, seguimiento del progreso y visualización de rankings.

A continuación, se describe el diagrama conceptual de los componentes principales y sus interacciones:

---

## Componentes Principales

1. **Clientes**:
   - **Web**: Interfaz web accesible a través de navegadores.
   - **Apps Nativas**: Aplicaciones móviles disponibles para plataformas como iOS y Android.

2. **API**:
   - Actúa como intermediaria entre los clientes y la base de datos.
   - Proporciona endpoints para autenticación, gestión de usuarios, preguntas, exámenes y resultados.

3. **Base de Datos (MongoDB)**:
   - Almacena toda la información del sistema, incluyendo usuarios, preguntas, exámenes y resultados.
   - Utiliza Mongoose para definir modelos y gestionar relaciones entre colecciones.

4. **Servicios Externos**:
   - **Email Service**: Se encarga de enviar correos electrónicos de verificación y explicativos a los usuarios.
   - **Tareas Programadas**: Actualiza el ranking diariamente.

---

## Interacciones entre Componentes

### 1. Cliente → API
- Los clientes (web y apps nativas) envían solicitudes HTTP a la API para realizar acciones como:
  - Registro e inicio de sesión.
  - Obtener preguntas y exámenes.
  - Enviar respuestas de exámenes.
  - Consultar resultados y rankings.

### 2. API → Base de Datos
- La API consulta y actualiza la base de datos MongoDB para:
  - Guardar nuevos registros de usuarios, preguntas y resultados.
  - Recuperar información sobre usuarios, exámenes y rankings.
  - Validar tokens de autenticación.

### 3. API → Servicios Externos
- La API interactúa con servicios externos para:
  - Enviar correos electrónicos de verificación y explicativos utilizando un servicio de correo.
  - Ejecutar tareas programadas para actualizar el ranking diariamente.

### 4. Base de Datos → API
- La base de datos proporciona datos solicitados por la API, asegurando que toda la información esté actualizada y consistente.

---

## Representación Visual (Descripción)
```
+----------------+       +----------------+       +----------------+
|                |       |                |       |                |
|    Clientes    |<----->|      API       |<----->|  Base de Datos |
| (Web/Apps)     |       |                |       |   (MongoDB)    |
|                |       |                |       |                |
+----------------+       +----------------+       +----------------+
                                   ^
                                   |
                           +----------------+
                           |                |
                           | Servicios      |
                           | Externos       |
                           | (Email, Tareas)|
                           |                |
                           +----------------+
```
### Notas sobre el Diagrama
- **Flechas**: Representan la dirección de las interacciones entre los componentes.
- **Clientes**: Pueden ser tanto aplicaciones web como nativas, conectándose a la API mediante solicitudes HTTP.
- **API**: Actúa como puente central entre los clientes, la base de datos y los servicios externos.
- **Base de Datos**: Almacena toda la información del sistema y gestiona las relaciones entre los datos.
- **Servicios Externos**: Son responsables de funciones específicas como el envío de correos electrónicos

---

## Conclusión

Este diagrama conceptual representa cómo los diferentes componentes del sistema interactúan entre sí para proporcionar una experiencia completa y eficiente a los usuarios. La modularidad y la separación de responsabilidades permiten una fácil expansión y mantenimiento del sistema.
# Resumen de los Modelos y Base de Datos

### MongoDB
- **Descripción**: MongoDB es una base de datos NoSQL orientada a documentos que almacena datos en formato BSON (similar a JSON). Es altamente escalable, flexible y permite trabajar con estructuras de datos complejas sin la necesidad de un esquema rígido.
- **Beneficios**:
  - **Flexibilidad**: Los documentos pueden tener diferentes estructuras dentro de una misma colección, lo que facilita la adaptación a cambios en los requisitos del sistema.
  - **Escalabilidad**: Soporta una alta carga de trabajo y puede escalar horizontalmente para manejar grandes volúmenes de datos.
  - **Rendimiento**: Ofrece un rendimiento óptimo para consultas complejas y operaciones de lectura/escritura frecuentes.

### Mongoose
- **Descripción**: Mongoose es una biblioteca de modelado de objetos para Node.js que proporciona un marco estructurado para interactuar con MongoDB. Permite definir modelos y esquemas que validan y controlan los datos antes de almacenarlos en la base de datos.
- **Beneficios**:
  - **Validación de Datos**: Proporciona mecanismos robustos para validar los datos antes de guardarlos en la base de datos, lo que mejora la integridad de los datos.
  - **Relaciones entre Colecciones**: Facilita la creación de relaciones entre documentos mediante referencias (`ObjectId`) y métodos como `populate`.
  - **Middleware**: Permite ejecutar funciones antes o después de ciertas operaciones (por ejemplo, guardar, eliminar), lo que es útil para tareas como el cifrado de contraseñas o la generación de tokens.

---

## Modelos Definidos

### 1. Modelo de Usuario (`User`)
El modelo `User` representa a los usuarios registrados en la plataforma y contiene información básica sobre ellos.

#### Campos:
- **name**: Nombre del usuario (requerido, longitud mínima: 2 caracteres, longitud máxima: 50 caracteres).
- **email**: Dirección de correo electrónico única y válida (requerida, validada con expresión regular).
- **verificationToken**: Token utilizado para verificar el correo electrónico (opcional).
- **emailVerified**: Indica si el correo electrónico ha sido verificado (booleano, por defecto: `false`).
- **password**: Contraseña del usuario (requerida, longitud mínima: 6 caracteres).
- **role**: Rol del usuario (`admin` o `client`, por defecto: `client`).

#### Características:
- Incluye validaciones para asegurar que los datos sean correctos y consistentes.
- El campo `password` no se expone directamente y debe ser cifrado antes de guardarlo en la base de datos.

---

### 2. Modelo de Pregunta (`Question`)
El modelo `Question` representa las preguntas disponibles en la plataforma, junto con sus opciones y respuesta correcta.

#### Campos:
- **content**: Contenido de la pregunta (requerido, texto limpio).
- **options**: Lista de opciones posibles (requeridas, mínimo 2 opciones).
- **answer**: Respuesta correcta (requerida).
- **topic**: Tema al que pertenece la pregunta (requerido).

#### Características:
- Asegura que cada pregunta tenga al menos dos opciones y una respuesta correcta.
- Se utiliza para generar exámenes y evaluar el conocimiento de los usuarios.

---

### 3. Modelo de Examen (`Exam`)
El modelo `Exam` representa los exámenes disponibles en la plataforma, incluyendo sus preguntas y duración.

#### Campos:
- **title**: Título del examen (por defecto: "Untitle").
- **questions**: Lista de IDs de preguntas relacionadas con este examen (requeridas).
- **duration**: Duración del examen en minutos (por defecto: 60, mínimo: 1 minuto).

#### Características:
- Establece una relación con el modelo `Question` mediante referencias (`ObjectId`).
- Asegura que cada examen tenga al menos una pregunta asociada.

---

### 4. Modelo de Resultado (`Result`)
El modelo `Result` almacena los resultados de los exámenes realizados por los usuarios.

#### Campos:
- **user**: ID del usuario que realizó el examen (requerido, referencia al modelo `User`).
- **exam**: ID del examen realizado (requerido, referencia al modelo `Exam`).
- **score**: Puntuación obtenida por el usuario en el examen (requerida, mínimo: 0).
- **date**: Fecha en la que se realizó el examen (por defecto: fecha actual).

#### Características:
- Establece relaciones con los modelos `User` y `Exam` para mantener un registro claro de quién realizó qué examen y cuál fue su puntuación.
- Se utiliza para llevar un seguimiento del progreso de los usuarios y generar rankings.

---

## Relaciones entre Modelos

- **Usuario y Resultado**: Un usuario puede tener múltiples resultados asociados, representando los exámenes que ha realizado.
- **Examen y Pregunta**: Un examen está compuesto por múltiples preguntas, vinculadas mediante referencias.
- **Resultado y Examen**: Cada resultado está asociado a un examen específico, permitiendo rastrear qué examen se realizó.

---

## Conclusión

La elección de MongoDB y Mongoose proporciona una solución eficiente y escalable para gestionar los datos de la aplicación. Los modelos definidos garantizan una estructura clara y consistente de los datos, mientras que las validaciones aseguran la integridad de la información almacenada. Esta arquitectura permite una fácil expansión y mantenimiento del sistema, cumpliendo con los requisitos funcionales establecidos.
# Descripción de los Endpoints

## Auth

Todas las rutas de autenticación están bajo el prefijo: */auths*

### 1. Registro de usuario
**Endpoint:** POST */auths/sign_up*
**Descripción:** Este endpoint permite registrar un nuevo usuario en la aplicación.
**Cuerpo de la solicitud (JSON):**
```
{
  "name": "tester1",
  "email": "tester1@example.com",
  "password": "securepassword"
}
```
**Flujo del proceso:**
1. Verifica si el usuario ya existe en la base de datos.
2. Si no existe, cifra la contraseña usando bcryptjs.
3. Genera un token de verificación utilizando crypto.
4. Crea un nuevo usuario en la base de datos con el token de verificación.
5. Envía un correo al email del usuario con un link de verificación y programa el envio de una una guía de bienvenida en 24 horas.
6. Devuelve una respuesta con el usuario registrado.
Respuestas:
- **201 Created:** Usuario registrado con éxito.
```
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "_id": "user_id",
      "name": "tester1",
      "email": "tester1@example.com",
      "role": "user"
    }
  }
  ```
- **409 Conflict:** El usuario ya existe.
```
  {
    "success": false,
    "message": "User already exists"
  }
```
### 2. Inicio de sesión
**Endpoint:** POST */auths/sign_in*
**Descripción:** Permite a un usuario existente autenticarse en la aplicación.
**Cuerpo de la solicitud (JSON):**
```
{
  "email": "tester1@example.com",
  "password": "securepassword"
}
```
**Flujo del proceso:**
1. Verifica si el usuario existe en la base de datos.
2. Verifica si el usuario ha sido verificado por correo electrónico.
3. Compara la contraseña ingresada con la almacenada usando bcryptjs.
4. Si la contraseña es válida, genera un token JWT.
5. Devuelve una respuesta con el usuario autenticado y el token.

**Respuestas:**
- **200 OK:** Usuario autenticado con éxito.
```
  {
    "success": true,
    "message": "User signed in successfully",
    "data": {
      "token": "jwt_token",
      "user": {
        "_id": "user_id",
        "name": "tester1",
        "email": "tester1@example.com",
        "role": "user"
      }
    }
  }
```
- **404 Not Found:** El usuario no existe o no está verificado.
```
  {
    "success": false,
    "message": "User not found"
  }
```
- **401 Unauthorized:** Contraseña incorrecta.
```
  {
    "success": false,
    "message": "Invalid password"
  }
  ```

### 3. Verificación de correo electrónico
**Endpoint:** GET /auths/verify_email/:token

**Descripción:** Este endpoint permite verificar el correo electrónico de un usuario mediante un token de verificación enviado por correo.

**Parámetros de la URL:**
- token: Token de verificación generado durante el registro.

**Flujo del proceso:**
1. Busca al usuario en la base de datos utilizando el token de verificación.
2. Si el token es válido, marca al usuario como verificado (emailVerified = true) y elimina el token de verificación.
3. Guarda los cambios en la base de datos.
4. Devuelve una respuesta indicando que el correo electrónico ha sido verificado.

**Respuestas:**
- **200 OK:** Correo electrónico verificado con éxito.
```
  {
    "success": true,
    "message": "Email verified successfully. You can now log in."
  }
```
- **400 Bad Request**: Token de verificación inválido o expirado.
```
  {
    "success": false,
    "message": "Invalid or expired verification token"
  }
```

## Ejemplo de registro y autenticación de múltiples usuarios

Para probar la API con varios usuarios, puedes enviar las siguientes solicitudes:

Registro de otro usuario (tester2)
```
{
  "name": "tester2",
  "email": "tester2@example.com",
  "password": "mypassword"
}
```

Inicio de sesión de tester2
```
{
  "email": "tester2@example.com",
  "password": "mypassword"
}
```

## Notas adicionales
- Se utiliza jsonwebtoken para la generación de tokens JWT.
- bcryptjs se emplea para cifrar y comparar contraseñas de manera segura.
- mongoose.startSession() se usa para manejar transacciones al registrar un usuario, asegurando la consistencia de los datos.
- Se envían correos electrónicos utilizando el servicio sendVerificationEmail y sendGuideEmail.
## Users

A continuación, se detalla la funcionalidad y uso de los endpoints relacionados con la gestión de usuarios en la API.

### 1. Obtener Todos los Usuarios (GET /users)

#### Descripción:
Este endpoint permite obtener una lista de todos los usuarios registrados en el sistema. Solo los usuarios autenticados con permisos de administrador pueden acceder a este recurso.

#### Parámetros:
- Headers:
  - Authorization: Token de autenticación JWT requerido para verificar la identidad del usuario.

#### Respuesta Exitosa:
- Código: 200 OK
- Ejemplo:
```json
{
    "success": true,
    "data": [
        {
            "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
            "name": "tester1",
            "email": "tester1@example.com",
            "role": "user"
        },
        {
            "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
            "name": "tester2",
            "email": "tester2@example.com",
            "role": "admin"
        }
    ]
}
```

#### Errores Posibles:
- 401 Unauthorized: Si el token de autenticación es inválido o no está presente.
- 403 Forbidden: Si el usuario no tiene permisos de administrador.

### 2. Obtener un Usuario por ID (GET /users/:id)

#### Descripción:
Este endpoint permite obtener la información de un usuario específico mediante su ID. Cualquier usuario autenticado puede acceder a este recurso.

#### Parámetros:
- URL:
  - id: El ID único del usuario que se desea consultar.
- Headers:
  - Authorization: Token de autenticación JWT.

#### Respuesta Exitosa:
- Código: 200 OK
- Ejemplo:
```json
{
    "success": true,
    "data": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "tester1",
        "email": "tester1@example.com",
        "role": "user"
    }
}
```
#### Errores Posibles:
- 401 Unauthorized: Si el token de autenticación es inválido o no está presente.
- 404 Not Found: Si no existe un usuario con el ID proporcionado.

### 3. Crear un Nuevo Usuario (POST /users)

#### Descripción:
Este endpoint permite crear un nuevo usuario en el sistema. Solo los usuarios autenticados con permisos de administrador pueden realizar esta acción.

#### Parámetros:
- Headers:
  - Authorization: Token de autenticación JWT.
- Body (JSON):
  - name: Nombre del usuario.
  - email: Dirección de correo electrónico del usuario (debe ser única).
  - password: Contraseña del usuario.
  - role: Rol del usuario (user o admin).

#### Respuesta Exitosa:
- Código: 201 Created
```json
- Ejemplo:
{
    "success": true,
    "message": "User created successfully",
    "data": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
        "name": "tester3",
        "email": "tester3@example.com",
        "role": "user"
    }
}
```
#### Errores Posibles:
- 400 Bad Request: Si falta algún campo obligatorio o si el formato de los datos no es válido.
- 401 Unauthorized: Si el token de autenticación es inválido o no está presente.
- 403 Forbidden: Si el usuario no tiene permisos de administrador.
- 409 Conflict: Si ya existe un usuario con el mismo correo electrónico.

### 4. Eliminar un Usuario por ID (DELETE /users/:id)

### Descripción:
Este endpoint permite eliminar un usuario del sistema mediante su ID. Solo los usuarios autenticados con permisos de administrador pueden realizar esta acción.

#### Parámetros:
- URL:
  - id: El ID único del usuario que se desea eliminar.
- Headers:
  - Authorization: Token de autenticación JWT.

#### Respuesta Exitosa:
- Código: 200 OK
```json
- Ejemplo:
{
    "success": true,
    "message": "User deleted successfully",
    "data": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "tester1",
        "email": "tester1@example.com",
        "role": "user"
    }
}
```
#### Errores Posibles:
- 401 Unauthorized: Si el token de autenticación es inválido o no está presente.
- 403 Forbidden: Si el usuario no tiene permisos de administrador.
- 404 Not Found: Si no existe un usuario con el ID proporcionado.

> Nota: Los endpoints protegidos requieren autenticación mediante un token JWT válido. Además, ciertas acciones están restringidas solo a usuarios con rol de 'admin'.
