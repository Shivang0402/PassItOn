const showToast = (message, type = "success") => {
  const notice = document.createElement("div");
  notice.className = `toast ${type}`;
  notice.textContent = message;
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 3000);
};

window.showToast = showToast;
