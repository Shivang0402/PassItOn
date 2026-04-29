const apiBase = `${window.location.origin}/api`;
const tokenKey = "passiton_token";

const auth = {
  get token() {
    return localStorage.getItem(tokenKey);
  },
  set token(value) {
    if (value) localStorage.setItem(tokenKey, value);
    else localStorage.removeItem(tokenKey);
  },
  get headers() {
    const headers = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  },
  get jsonHeaders() {
    return { ...this.headers, "Content-Type": "application/json" };
  },
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Request failed");
  }
  return body;
};

const fetchFormData = async (url, formData, options = {}) => {
  const response = await fetch(url, {
    method: options.method || "POST",
    headers: auth.headers,
    body: formData,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Request failed");
  }
  return body;
};

const loadProfile = async () => {
  const response = await fetch(`${apiBase}/auth/me`, { headers: auth.headers });
  if (!response.ok) {
    auth.token = null;
    window.location.href = "login.html";
    return null;
  }
  const profile = await response.json();
  return { ...profile, id: profile.id || profile._id };
};

const handleLogout = () => {
  auth.token = null;
  window.location.href = "../index.html";
};

window.apiBase = apiBase;
window.auth = auth;
window.fetchJson = fetchJson;
window.fetchFormData = fetchFormData;
window.loadProfile = loadProfile;
window.handleLogout = handleLogout;
