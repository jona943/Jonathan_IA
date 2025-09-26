# Creación de un Servidor Web con IA (Gemini y FastAPI) desde Cero

Esta guía te llevará paso a paso en la creación de una aplicación de chat con inteligencia artificial. Construiremos un backend seguro con Python y FastAPI que se comunicará con la API de Gemini, y un frontend simple con HTML, CSS y JavaScript para interactuar con él.

---

## 📚 Tabla de Contenidos
1. [Requisitos Previos](#1-requisitos-previos)
2. [Paso 1: Configuración del Entorno del Proyecto](#2-paso-1-configuración-del-entorno-del-proyecto)
3. [Paso 2: Instalación de Dependencias](#3-paso-2-instalación-de-dependencias)
4. [Paso 3: Creación del Servidor Backend con FastAPI](#4-paso-3-creación-del-servidor-backend-con-fastapi)
5. [Paso 4: Creación de la Interfaz del Frontend](#5-paso-4-creación-de-la-interfaz-del-frontend)
6. [Paso 5: Conexión y Pruebas (El Flujo Completo)](#6-paso-5-conexión-y-pruebas-el-flujo-completo)
7. [Conclusión y Próximos Pasos](#7-conclusión-y-próximos-pasos)

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

* **Python (versión 3.8 o superior)**: [Descargar Python](https://www.python.org/downloads/)
* **Un editor de código**: Se recomienda [Visual Studio Code](https://code.visualstudio.com/).
* **Una cuenta de Ngrok**: Para exponer tu servidor local a internet. [Crear cuenta en Ngrok](https://dashboard.ngrok.com/signup).
* **Una API Key de Google AI Studio**: Para acceder al modelo Gemini. [Obtener API Key](https://aistudio.google.com/app/apikey).

---

## 2. Paso 1: Configuración del Entorno del Proyecto

Vamos a crear una estructura de proyecto limpia y un entorno virtual para aislar nuestras dependencias.

1.  **Crea una carpeta para el proyecto** y navega hacia ella en tu terminal.
    ```bash
    mkdir mi-proyecto-ia
    cd mi-proyecto-ia
    ```

2.  **Crea y activa un entorno virtual.** Un entorno virtual (`venv`) es una "burbuja" que mantiene las librerías de este proyecto separadas de las de otros.

    * En **macOS / Linux**:
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    * En **Windows**:
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
    Sabrás que funcionó porque tu terminal ahora mostrará `(venv)` al principio de la línea.

---

## 3. Paso 2: Instalación de Dependencias

1.  **Crea un archivo `requirements.txt`**. Este archivo listará todas las librerías de Python que necesita nuestro proyecto.
    ```txt
    # requirements.txt
    fastapi
    uvicorn
    google-generativeai
    python-dotenv
    ```

2.  **Instala las librerías** usando el siguiente comando en tu terminal (con el `venv` activado):
    ```bash
    pip install -r requirements.txt
    ```

---

## 4. Paso 3: Creación del Servidor Backend con FastAPI

El backend es el "cerebro" de nuestra aplicación. Se encargará de recibir las peticiones del frontend y comunicarse con la API de Gemini de forma segura.

Nuestra estructura de archivos se verá así:

mi-proyecto-ia/
├── venv/
├── .env
├── .gitignore
├── main.py
└── requirements.txt

### 4.1. Proteger la API Key (`.env`)
Nunca pongas tus claves secretas directamente en el código. Usa un archivo `.env` para guardarlas.

Crea un archivo llamado `.env` y añade tu clave de Gemini:

.env
GEMINI_API_KEY="AIzaSy...TU_CLAVE_API_DE_GEMINI"

### 4.2. Ignorar Archivos Sensibles (`.gitignore`)
Para evitar subir archivos innecesarios o secretos a un repositorio como GitHub, crea un archivo `.gitignore`.


.gitignore
venv/
.env
pycache/
*.pyc

### 4.3. Escribir el Código del Servidor (`main.py`)
Este es el corazón de nuestro backend.

```python
# main.py
import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Cargar las variables de entorno del archivo .env
load_dotenv()

# --- Configuración Inicial ---
try:
    # Configura la API de Google con la clave del .env
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    raise RuntimeError("La variable de entorno GEMINI_API_KEY no está configurada.")

# Selecciona el modelo a usar
model = genai.GenerativeModel("gemini-1.5-flash")

# --- Aplicación FastAPI ---
app = FastAPI()

# Configurar CORS para permitir peticiones desde cualquier origen (ideal para desarrollo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Modelos de Datos (Pydantic) ---
# Define la estructura esperada para los datos de entrada (el cuerpo de la petición POST)
class PromptRequest(BaseModel):
    prompt: str

# --- Endpoints de la API ---
@app.get("/")
def read_root():
    """Endpoint raíz para verificar que la API está viva."""
    return {"status": "API funcionando correctamente"}

@app.post("/generate")
async def generate_content(request: PromptRequest):
    """
    Endpoint principal que recibe un prompt y devuelve la respuesta de Gemini.
    """
    if not request.prompt:
        raise HTTPException(status_code=400, detail="El prompt no puede estar vacío.")

    try:
        # Llama a la API de Gemini para generar contenido
        response = model.generate_content(request.prompt)
        # Devuelve la respuesta en formato JSON
        return JSONResponse(content={"response": response.text})
    except Exception as e:
        # Manejo de errores en caso de que la API de Google falle
        raise HTTPException(status_code=500, detail=f"Error al generar contenido: {str(e)}")


5. Paso 4: Creación de la Interfaz del Frontend
El frontend es lo que el usuario ve y usa. Consiste en tres archivos que debes crear en la misma carpeta del proyecto.
5.1. index.html (La Estructura)
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat con IA</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="chat-container">
    <div id="messages"></div>
    <div id="input-container">
      <input type="text" id="user-input" placeholder="Escribe tu mensaje..." autofocus>
      <button id="send-btn">Enviar</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>

5.2. style.css (El Diseño)
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
#chat-container {
  width: 90%;
  max-width: 500px;
  height: 80vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
#messages {
  flex: 1;
  overflow-y: auto;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.message { margin-bottom: 0.5rem; padding: 0.5rem 1rem; border-radius: 18px; max-width: 80%; word-wrap: break-word; }
.user { background-color: #007bff; color: white; align-self: flex-end; margin-left: auto; }
.bot { background-color: #e9e9eb; color: #333; align-self: flex-start; }
#input-container { display: flex; }
#user-input { flex: 1; padding: 0.75rem; border: 1px solid #ccc; border-radius: 18px 0 0 18px; outline: none; }
#send-btn { padding: 0.75rem 1.5rem; border: none; background: #007bff; color: white; border-radius: 0 18px 18px 0; cursor: pointer; }
#send-btn:hover { background: #0056b3; }

5.3. script.js (La Lógica)
const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// URL del servidor. ¡ESTA DEBE ACTUALIZARSE CADA VEZ QUE INICIES NGROK!
const API_URL = "https://PON_AQUI_TU_URL_DE_NGROK.ngrok-free.app/generate";

// Función para añadir mensajes al chat
function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender); // 'user' o 'bot'
  messageDiv.innerText = text;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Función para enviar el mensaje
async function sendMessage() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  addMessage("user", prompt);
  userInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    });

    if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    addMessage("bot", data.response);

  } catch (error) {
    addMessage("bot", `Error al conectar con el servidor: ${error.message}`);
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

6. Paso 5: Conexión y Pruebas (El Flujo Completo)
Ahora, vamos a unir todas las piezas para que funcionen juntas.
 * Iniciar el Servidor Backend:
   En tu primera terminal (con el venv activado), ejecuta:
   uvicorn main:app --reload

   Deja esta terminal abierta.
 * Exponer con Ngrok:
   Abre una segunda terminal y ejecuta:
   ngrok http 8000

   Copia la URL https://...ngrok-free.app que te proporciona.
 * Actualizar el Frontend:
   Abre script.js y pega la URL de Ngrok en la constante API_URL. ¡Asegúrate de que termine en /generate! Guarda el archivo.
 * Probar la Aplicación:
   Busca tu archivo index.html y ábrelo con tu navegador web. ¡Ya puedes chatear con tu IA!
7. Conclusión y Próximos Pasos
¡Felicidades! Has construido una aplicación web de IA completa desde cero. Ahora tienes un backend seguro y un frontend funcional.
Próximos Pasos:
 * Mejorar el CSS: Dale tu propio estilo al chat.
 * Añadir historial: Guarda la conversación en el localStorage del navegador.
 * Desplegar en la nube: Para obtener una URL permanente y no depender de Ngrok, puedes desplegar tu backend de FastAPI en servicios como Render o Google Cloud Run.
<!-- end list -->

