## Manual Rápido de Ejecución: API de IA 🚀
Este manual asume que todos los archivos ya están creados y las dependencias instaladas. Sigue estos pasos en orden cada vez que quieras iniciar tu chat.

### 1. Iniciar el Servidor (Backend) 💻
Este proceso activa tu "cerebro" de IA en tu computadora.
 * Abre una terminal.
 * Navega hasta la carpeta de tu proyecto.
   cd ruta/a/tu/proyecto/mi-api-gemini

 * Activa el entorno virtual. ¡Este paso es crucial!
   source venv/bin/activate

 * Ejecuta el servidor con Uvicorn.
   uvicorn main:app

Importante: Verás un mensaje que dice Uvicorn running on http://127.0.0.1:8000. Deja esta terminal abierta; si la cierras, el servidor se detendrá.


### 2. Exponer el Servidor con Ngrok 🔗
Este paso crea el túnel para que tu página web pueda comunicarse con tu servidor.
 * Abre una segunda terminal (no cierres la primera).
 * Ejecuta Ngrok para apuntar al puerto de tu servidor (que es el 8000).
   ngrok http 8000
 * En la pantalla de Ngrok, busca la línea "Forwarding" y copia la URL que empieza con https://. Esta es tu dirección pública temporal.

### 3. Actualizar la URL en el Frontend 📝
Ahora debes decirle a tu página web cuál es la nueva dirección del servidor.
 * Abre tu archivo script.js en un editor de código.
 * Busca la línea que contiene el fetch.
 * Pega la nueva URL que copiaste de Ngrok. ¡No olvides añadir /generate al final!
   // Pega aquí la URL que te dio Ngrok en el paso anterior
const response = await fetch("https://TU_NUEVA_URL_DE_NGROK.ngrok-free.app/generate", { 
    // ...
});

 * Guarda los cambios en el archivo script.js.
### 4. ¡Usar la Aplicación! ✅
¡Todo está listo!
 * Busca tu archivo index.html en tu explorador de archivos.
 * Haz doble clic para abrirlo en tu navegador web (Google Chrome, Firefox, etc.).

