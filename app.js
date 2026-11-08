const byId = (id) => document.getElementById(id);

async function checkHealth() {
  const output = byId("health-result");
  const status = byId("platform-status");

  output.textContent = "Checking...";

  try {
    const response = await fetch("/api/health");

    if (!response.ok) {
      throw new Error("Server returned an error.");
    }

    const data = await response.json();

    output.textContent =
      `${data.platform}\nStatus: ${data.status}\nVersion: ${data.version}`;

    status.textContent = "Online";
  } catch (error) {
    output.textContent = "Backend unavailable. Start the FastAPI server.";
    status.textContent = "Offline";
  }
}

byId("health-button").addEventListener("click", checkHealth);

async function generateHash() {
  const text = byId("hash-input").value;
  const output = byId("hash-result");

  if (!text.trim()) {
    output.textContent = "Enter some text first.";
    return;
  }

  output.textContent = "Generating...";

  try {
    const response = await fetch("/api/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Hash generation failed.");
    }

    output.textContent = `${data.algorithm}\n${data.hash}`;
  } catch (error) {
    output.textContent = error.message;
  }
}

byId("hash-button").addEventListener("click", generateHash);

function checkPassword() {
  const value = byId("password-input").value;
  const output = byId("password-result");

  if (!value) {
    output.textContent = "Enter a sample password.";
    return;
  }

  let score = 0;

  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const messages = [
    "Needs improvement",
    "Basic",
    "Fair",
    "Good",
    "Stronger sample"
  ];

  output.textContent = messages[score] +
    ". This is only a basic estimate, not a security guarantee.";
}

byId("password-button").addEventListener("click", checkPassword);

function submitQuiz() {
  const selected = document.querySelector('input[name="quiz"]:checked');
  const output = byId("quiz-result");

  if (!selected) {
    output.textContent = "Choose an answer first.";
    return;
  }

  if (selected.value === "b") {
    output.textContent =
      "Correct! Visit the official website independently and verify the message.";
  } else {
    output.textContent =
      "Not quite. Avoid unexpected sign-in links and verify through the official website.";
  }
}

byId("quiz-button").addEventListener("click", submitQuiz);

checkHealth();
