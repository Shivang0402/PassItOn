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

const showToast = (message, type = "success") => {
  const notice = document.createElement("div");
  notice.className = `toast ${type}`;
  notice.textContent = message;
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 3000);
};

const handleLogout = () => {
  auth.token = null;
  window.location.href = "../index.html";
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

const initLoginPage = () => {
  if (!document.getElementById("loginForm")) return;
  if (auth.token) window.location.href = "dashboard.html";

  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
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
      showToast(error.message, "error");
    }
  });
};

const initRegisterPage = () => {
  if (!document.getElementById("registerForm")) return;
  if (auth.token) window.location.href = "dashboard.html";

  const form = document.getElementById("registerForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
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
      showToast(error.message, "error");
    }
  });
};

const initForgotPasswordPage = () => {
  const form = document.getElementById("forgotForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
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
      showToast(error.message, "error");
    }
  });
};

const buildItemCard = (item, currentUserId, onClaim, onEdit) => {
  const card = document.createElement("div");
  card.className = "passiton-card";
  card.innerHTML = `
    <div class="passiton-photo">
      <img src="${item.imageUrl || "../assets/sheet container.avif"}" alt="${item.title}" />
    </div>
    <div class="passiton-info">
      <div class="passiton-item">${item.title}</div>
      <div class="passiton-description">${item.description}</div>
      <div class="passiton-price-button">
        <div class="passiton-price">₹${item.price}</div>
      </div>
    </div>
  `;

  const priceButtonRow = card.querySelector(".passiton-price-button");
  const actionButton = document.createElement("button");
  const isOwner = String(item.owner) === String(currentUserId);
  const isAvailable = item.status === "available";

  if (isOwner) {
    actionButton.textContent = "Reserve";
    actionButton.disabled = true;
    actionButton.title = "You cannot reserve your own item.";
  } else if (isAvailable) {
    actionButton.textContent = "Reserve";
    actionButton.type = "button";
    actionButton.addEventListener("click", () => onClaim(item));
  } else {
    actionButton.textContent = "Claimed";
    actionButton.disabled = true;
  }

  priceButtonRow.appendChild(actionButton);
  return card;
};

const buildProfileListItem = (
  item,
  currentUserId,
  onEdit = null,
  onReceive = null,
  isClaimedSection = false,
) => {
  const actionButtonHtml =
    String(item.owner) === String(currentUserId)
      ? item.status === "claimed"
        ? `<button type="button" class="account-action-btn account-receive-btn">Mark received</button>`
        : item.status === "received"
          ? `<button type="button" class="account-action-btn account-received-btn" disabled>Received</button>`
          : `<button type="button" class="account-action-btn account-edit-btn">Edit</button>`
      : "";

  const row = document.createElement("div");
  row.className = "account-item";
  row.innerHTML = `
    <div class="account-photo">
      <img src="${item.imageUrl || "../assets/sheet container.avif"}" alt="${item.title}" />
    </div>
    <div class="account-content">
      <div class="account-title">${item.title}</div>
      <div class="account-description">${item.description}</div>
      <div class="account-meta">
        <span>Price: ₹${item.price}</span>
        <span>Status: ${item.status}</span>
        ${isClaimedSection ? `<span>Owner: ${item.ownerName}</span>` : ""}
        ${item.claimedByName ? `<span>Claimed by: ${item.claimedByName}</span>` : ""}
      </div>
    </div>
    <div class="account-actions">
      ${actionButtonHtml}
    </div>
  `;

  const editButton = row.querySelector(".account-edit-btn");
  if (editButton && onEdit) {
    editButton.addEventListener("click", () => onEdit(item));
  }

  const receiveButton = row.querySelector(".account-receive-btn");
  if (receiveButton && onReceive) {
    receiveButton.addEventListener("click", () => onReceive(item, row));
  }

  return row;
};

const initDashboardPage = async () => {
  if (typeof initSearchPage === "function") {
    await initSearchPage();
  }
};

const initAccountPage = async () => {
  const profileForm = document.getElementById("profileForm");
  const addItemForm = document.getElementById("addItemForm");
  const myListings = document.getElementById("myListings");
  const claimedListings = document.getElementById("claimedListings");
  if (!profileForm || !addItemForm || !myListings || !claimedListings) return;

  const profile = await loadProfile();
  if (!profile) return;

  document.getElementById("name").value = profile.name;
  document.getElementById("email").value = profile.email;
  document.getElementById("userNameHeader").textContent = profile.name;

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    try {
      await fetchJson(`${apiBase}/auth/me`, {
        method: "PUT",
        headers: auth.jsonHeaders,
        body: JSON.stringify({ name, email }),
      });
      showToast("Profile updated.");
      document.getElementById("userNameHeader").textContent = name;
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  addItemForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("itemTitle").value.trim();
    const description = document.getElementById("itemDescription").value.trim();
    const price = document.getElementById("itemPrice").value.trim();
    const imageInput = document.getElementById("itemImage");
    const imageFile = imageInput.files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (imageFile) formData.append("image", imageFile);

    try {
      await fetchFormData(`${apiBase}/items`, formData, { method: "POST" });
      showToast("Item added successfully.");
      addItemForm.reset();
      loadMyItems();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  const loadMyItems = async () => {
    const my = await fetchJson(`${apiBase}/items/mine`, {
      headers: auth.headers,
    });
    myListings.innerHTML = "";
    if (!my.length) {
      myListings.innerHTML = "<p class='empty-state'>No items listed yet.</p>";
    } else {
      my.forEach((item) => {
        const row = buildProfileListItem(
          item,
          profile.id,
          async () => {
            const newTitle = prompt("Edit title", item.title);
            if (!newTitle) return;
            const newDescription = prompt("Edit description", item.description);
            const newPrice = prompt("Edit price", item.price);
            try {
              await fetchJson(`${apiBase}/items/${item._id}`, {
                method: "PUT",
                headers: auth.jsonHeaders,
                body: JSON.stringify({
                  title: newTitle,
                  description: newDescription,
                  price: newPrice,
                }),
              });
              showToast("Item updated.");
              loadMyItems();
            } catch (error) {
              showToast(error.message, "error");
            }
          },
          async (itemToReceive) => {
            try {
              await fetchJson(`${apiBase}/items/${itemToReceive._id}`, {
                method: "PUT",
                headers: auth.jsonHeaders,
                body: JSON.stringify({ status: "received" }),
              });
              showToast("Item marked as received.");
              loadMyItems();
            } catch (error) {
              showToast(error.message, "error");
            }
          },
          false,
        );
        myListings.appendChild(row);
      });
    }
  };

  const loadClaimedItems = async () => {
    const claimed = await fetchJson(`${apiBase}/items/claimed`, {
      headers: auth.headers,
    });
    claimedListings.innerHTML = "";
    if (!claimed.length) {
      claimedListings.innerHTML =
        "<p class='empty-state'>You have not claimed any items yet.</p>";
    } else {
      claimed.forEach((item) => {
        const card = buildProfileListItem(item, profile.id, null, null, true);
        claimedListings.appendChild(card);
      });
    }
  };

  await loadMyItems();
  await loadClaimedItems();
};

const initListItemPage = async () => {
  const addItemForm = document.getElementById("addItemForm");
  if (!addItemForm) return;

  const profile = await loadProfile();
  if (!profile) return;

  addItemForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("itemTitle").value.trim();
    const description = document.getElementById("itemDescription").value.trim();
    const price = document.getElementById("itemPrice").value.trim();
    const imageInput = document.getElementById("itemImage");
    const imageFile = imageInput.files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (imageFile) formData.append("image", imageFile);

    try {
      await fetchFormData(`${apiBase}/items`, formData, { method: "POST" });
      showToast("Item added successfully.");
      addItemForm.reset();
    } catch (error) {
      showToast(error.message, "error");
    }
  });
};

const initMyListingsPage = async () => {
  const myListings = document.getElementById("myListings");
  if (!myListings) return;

  const profile = await loadProfile();
  if (!profile) return;

  const loadMyItems = async () => {
    const my = await fetchJson(`${apiBase}/items/mine`, {
      headers: auth.headers,
    });
    myListings.innerHTML = "";
    if (!my.length) {
      myListings.innerHTML = "<p class='empty-state'>No items listed yet.</p>";
    } else {
      my.forEach((item) => {
        const row = buildProfileListItem(
          item,
          profile.id,
          async () => {
            const newTitle = prompt("Edit title", item.title);
            if (!newTitle) return;
            const newDescription = prompt("Edit description", item.description);
            const newPrice = prompt("Edit price", item.price);
            try {
              await fetchJson(`${apiBase}/items/${item._id}`, {
                method: "PUT",
                headers: auth.jsonHeaders,
                body: JSON.stringify({
                  title: newTitle,
                  description: newDescription,
                  price: newPrice,
                }),
              });
              showToast("Item updated.");
              loadMyItems();
            } catch (error) {
              showToast(error.message, "error");
            }
          },
          async (itemToReceive) => {
            try {
              await fetchJson(`${apiBase}/items/${itemToReceive._id}`, {
                method: "PUT",
                headers: auth.jsonHeaders,
                body: JSON.stringify({ status: "received" }),
              });
              showToast("Item marked as received.");
              loadMyItems();
            } catch (error) {
              showToast(error.message, "error");
            }
          },
          false,
        );
        myListings.appendChild(row);
      });
    }
  };

  await loadMyItems();
};

const initFileInputs = () => {
  document.querySelectorAll(".file-upload-input").forEach((input) => {
    const wrapper = input.closest(".file-upload");
    const nameSpan = wrapper?.querySelector(".file-upload-name");
    const updateName = () => {
      if (!nameSpan) return;
      nameSpan.textContent = input.files.length
        ? input.files[0].name
        : "No file chosen";
    };
    input.addEventListener("change", updateName);
    updateName();
  });
};

const initCommon = () => {
  const logoutLinks = document.querySelectorAll(".logout-link");
  logoutLinks.forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogout();
    }),
  );
};

const initPage = async () => {
  initCommon();
  initFileInputs();
  initLoginPage();
  initRegisterPage();
  initForgotPasswordPage();
  await initDashboardPage();
  initAccountPage();
  initListItemPage();
  initMyListingsPage();
};

document.addEventListener("DOMContentLoaded", initPage);
