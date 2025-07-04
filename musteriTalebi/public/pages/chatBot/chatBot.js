const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender === 'user' ? 'user-msg' : 'bot-msg');

  // Kod bloğu içeriyorsa
  if (text.includes("```")) {
    const codeMatch = text.match(/```(\w*)\n?([\s\S]*?)```/);
    if (codeMatch) {
      const language = codeMatch[1] || 'plaintext'; // örneğin: js, html, python
      const code = codeMatch[2];
      msgDiv.innerHTML = `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
    } else {
      msgDiv.textContent = text;
    }
  } else {
    msgDiv.textContent = text;
  }

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';
  userInput.disabled = true;
  sendBtn.disabled = true;

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error('Sunucudan cevap alınamadı.');

    const data = await response.json();

    if (data.reply) {
      addMessage(data.reply, 'bot');
    } else {
      addMessage('Yanıt alınamadı.', 'bot');
    }
  } catch (error) {
    addMessage('Sunucuya bağlanırken hata oluştu.', 'bot');
    console.error(error);
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Enter basınca form gönderilmesin
    sendMessage();
  }
});

