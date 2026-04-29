const initLoginPage = () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  if (auth.token) {
    window.location.href = "dashboard.html";
    return;
  }

  const errorContainer = document.getElementById("formError");
    const setFormError = (message) => {
      if (errorContainer) errorContainer.textContent = message;
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setFormError("");

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const data = await fetchJson(`${apiBase}/auth/login`, {
        method: "POST",
        headers: auth.jsonHeaders,
        body: JSON.stringify({ email, password }),
      });
      auth.token = data.token;
      window.location.href = "dashboard.html";
    } catch (error) {
      setFormError(error.message);
      showToast(error.message, "error");
    }
  });
};

const initRegisterPage = () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const errorContainer = document.getElementById("formError");
  const setFormError = (message) => {
    if (errorContainer) errorContainer.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setFormError(message);
      showToast(message, "error");
      return;
    }

    try {
      const data = await fetchJson(`${apiBase}/auth/register`, {
        method: "POST",
        headers: auth.jsonHeaders,
        body: JSON.stringify({ name, email, password }),
      });
      auth.token = data.token;
      window.location.href = "dashboard.html";
    } catch (error) {
      setFormError(error.message);
      showToast(error.message, "error");
    }
  });
};

const initForgotPasswordPage = () => {
  const form = document.getElementById("forgotForm");
  if (!form) return;

  const errorContainer = document.getElementById("formError");
  const setFormError = (message) => {
    if (errorContainer) errorContainer.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    try {
      const data = await fetchJson(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: auth.jsonHeaders,
        body: JSON.stringify({ email, newPassword }),
      });
      showToast(data.message);
      window.location.href = "login.html";
    } catch (error) {
      setFormError(error.message);
      showToast(error.message, "error");
    }
  });
};

window.initLoginPage = initLoginPage;
window.initRegisterPage = initRegisterPage;
window.initForgotPasswordPage = initForgotPasswordPage;
