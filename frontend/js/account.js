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
  const profileGreeting = document.getElementById("profileGreeting");
  if (profileGreeting) profileGreeting.textContent = profile.name;

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

  const setProfileCounts = (activeCountValue, claimedCountValue) => {
    const activeCountEl = document.getElementById("activeCount");
    const claimedCountEl = document.getElementById("claimedCount");
    if (activeCountEl) activeCountEl.textContent = activeCountValue;
    if (claimedCountEl) claimedCountEl.textContent = claimedCountValue;
  };

  let savedActiveCount = 0;
  let savedClaimedCount = 0;

  const loadMyItems = async () => {
    const my = await fetchJson(`${apiBase}/items/mine`, {
      headers: auth.headers,
    });
    myListings.innerHTML = "";
    savedActiveCount = my.length;
    setProfileCounts(savedActiveCount, savedClaimedCount);
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
    savedClaimedCount = claimed.length;
    setProfileCounts(savedActiveCount, savedClaimedCount);
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
              await fetchJson(`${apiBase}/items/${itemToReceive._1d}`, {
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

window.initAccountPage = initAccountPage;
window.initMyListingsPage = initMyListingsPage;
