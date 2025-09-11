async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const input = inputField.value.trim();
  if (!input) return;

  const messages = document.getElementById("messages");

  // Mensaje del usuario
  messages.innerHTML += `<div class="message user"><b>Tú:</b> ${input}</div>`;

  try {
    const response = await fetch(" https://da43486dc1c3.ngrok-free.app/generate", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: input })
    });

    const data = await response.json();

    if (data.response) {
      messages.innerHTML += `<div class="message bot"><b>IA:</b> ${data.response}</div>`;
    } else {
      messages.innerHTML += `<div class="message bot"><b>IA:</b> Error - ${data.error}</div>`;
    }
  } catch (err) {
    messages.innerHTML += `<div class="message bot"><b>IA:</b> Error al conectar con el servidor</div>`;
  }

  inputField.value = "";
  messages.scrollTop = messages.scrollHeight; // scroll automático
}

// Enviar con botón
document.getElementById("send-btn").addEventListener("click", sendMessage);

// Enviar con Enter
document.getElementById("user-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});