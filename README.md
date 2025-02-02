# Dailyfitz
Esta aplicación está diseñada para trabajar con la base de datos Prisma disponible en: https://github.com/ThiagoFantino/server. Se utilizó Expo, una herramienta poderosa para desarrollar aplicaciones móviles de manera rápida y eficiente, aprovechando un entorno basado en React Native que permite probar y desplegar aplicaciones en múltiples plataformas.  
Dailyfitz es una aplicación que busca brindar a los usuarios una experiencia completa de ejercitación, ofreciendo funciones útiles como:
+ Seguimiento de calorías quemadas al realizar rutinas de ejercicios.
+ Creación de rutinas personalizadas, adaptadas a las necesidades individuales.
+ Seguimiento de estadísticas a lo largo del tiempo, permitiendo monitorear el progreso.
Y mucho más.

## Instalación y ejecución
Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/ThiagoFantino/dailyfitz
```
Instala las dependencias necesarias ejecutando el siguiente comando en la terminal dentro del directorio del proyecto:
```bash
npm install
```
En el archivo .env, cambia la dirección ip presente por la dirección ip privada de la computadora que esté corriendo el servidor (se obtiene con el comando ipconfig en cmd).
Inicia la aplicación con:

```bash
npm run start
```
Escanea el código QR que aparecerá en tu terminal con la aplicación Expo Go en tu dispositivo móvil, o ejecuta el proyecto desde un navegador, presente en el puerto local 8081.
### Pantallas de la aplicación
La aplicación cuenta con varias pantallas que ofrecen diferentes funcionalidades. A continuación, se describen brevemente:
+ Pantalla de login: Formulario necesario para iniciar sesión. A través de esta pantalla se puede ingresar a la pantalla de creación de cuenta.
+ Pantalla de signup: Formulario de creación de cuenta.
+ Pantalla de inicio: Muestra todas las rutinas, tanto las globales como las personalizadas del usuario, y permite borrar las mismas.
+ Pantalla de rutina: Permite ver los ejercicios presentes en las rutinas, las series, las repeticiones, las calorías totales quemadas en ese ejercicio y los tiempos de descanso entre series.
+ Pantalla de creación de rutina: En esta pantalla se pueden seleccionar los parámetros de la rutina personalizada, como el nombre, ejercicio, sus sets y repeticiones, imagen para la rutina y tiempo de descanso.
+ Pantalla de perfil: Permite ver el progreso del usuario a lo largo del tiempo, mostrando las estadísticas en distintos periodos de tiempo (día, semana, mes, año). También se muestra un calendario que permite ver el resumen de un día a elección. Desde esta pantalla se puede acceder a dos pantallas de configuración de la información del usuario:
+ Pantalla de Datos Personales: Formulario para cambiar datos del usuario como nombre, apellido y correo electrónico.
+ Pantalla de Selección de foto de perfil: Permite la selección de una foto para el perfil del usuario.
+ Pantalla de Podómetro: Permite el acceso a un podómetro. Cuando el usuario decide terminar el ejercicio, el tiempo de ejercitación y las calorías quemadas se suben a la base de datos

### Dependencias principales
+ Expo: Para el desarrollo y ejecución de la aplicación.
+ React Native: Para construir la interfaz de usuario.
+ Otras dependencias se pueden consultar en el archivo package.json.
### Contribución
Si deseas contribuir a este proyecto, sigue estos pasos:
Haz un fork del repositorio.
Crea una rama con tu nueva funcionalidad o corrección de errores: 

```bash
git checkout -b feature/nueva-funcionalidad.
```

Realiza tus cambios y haz commits.
Envía un pull request para revisión.


Esperamos que disfrutes usando Dailyfitz tanto como nosotros disfrutamos desarrollándolo.


