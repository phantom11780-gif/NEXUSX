const form = document.getElementById("chat-form");
const promptInput = document.getElementById("prompt");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("send");
const welcome = document.getElementById("welcome");
const clearButton = document.getElementById("clear");
const sidebar = document.querySelector(".sidebar");

function addMessage(text, type) {
const message = document.createElement("div");
message.className = "message ${type}";
message.textContent = text;
messages.appendChild(message);

message.scrollIntoView({
behavior: "smooth",
block: "nearest"
});
}

async function sendPrompt(text) {
const prompt = text.trim();

if (!prompt || sendButton.disabled) return;

welcome.style.display = "none";
addMessage(prompt, "user");

promptInput.value = "";
promptInput.style.height = "auto";

sendButton.disabled = true;
sendButton.querySelector("span").textContent = "صبر کن";

const loading = document.createElement("div");
loading.className = "message ai";
loading.textContent = "NOVA در حال فکر کردن است...";
messages.appendChild(loading);

try {
const response = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ prompt })
});

const data = await response.json();
loading.remove();

if (!response.ok) {
  throw new Error(data.error || "درخواست ناموفق بود.");
}

addMessage(data.reply || "پاسخی دریافت نشد.", "ai");

} catch (error) {
loading.remove();

addMessage(
  error.message || "اتصال برقرار نشد. دوباره تلاش کن.",
  "error"
);

} finally {
sendButton.disabled = false;
sendButton.querySelector("span").textContent = "ارسال";
promptInput.focus();
}
}

form.addEventListener("submit", (event) => {
event.preventDefault();
sendPrompt(promptInput.value);
});

promptInput.addEventListener("input", () => {
promptInput.style.height = "auto";
promptInput.style.height =
Math.min(promptInput.scrollHeight, 180) + "px";
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
button.addEventListener("click", () => {
promptInput.value = button.dataset.prompt;
promptInput.focus();

promptInput.setSelectionRange(
  promptInput.value.length,
  promptInput.value.length
);

sidebar.classList.remove("open");

});
});

clearButton.addEventListener("click", () => {
messages.replaceChildren();
welcome.style.display = "";
promptInput.value = "";
sidebar.classList.remove("open");
});

document.getElementById("menu").addEventListener("click", () => {
sidebar.classList.toggle("open");
});