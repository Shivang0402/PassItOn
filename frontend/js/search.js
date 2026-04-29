const initSearchPage = async () => {
  const browseContainer = document.getElementById("browseItems");
  const searchInput = document.getElementById("searchInput");
  if (!browseContainer || !searchInput) return;

  const profile = await loadProfile();
  if (!profile) return;

  const greeting = document.querySelector(".user_msg");
  if (greeting) greeting.textContent = `Hello, ${profile.name}`;

  const loadItems = async (query = "") => {
    const items = await fetchJson(`${apiBase}/items`);
    const term = query.trim().toLowerCase();

    const filtered = items
      .filter((item) => item.status === "available")
      .filter((item) => {
        if (!term) return true;
        return [item.title, item.description, item.ownerName].some((field) =>
          field?.toLowerCase().includes(term),
        );
      });

    browseContainer.innerHTML = "";

    if (!filtered.length) {
      browseContainer.innerHTML =
        "<p class='empty-state'>No items matched your search.</p>";
      return;
    }

    filtered.forEach((item) => {
      const card = buildItemCard(item, profile.id, async () => {
        try {
          await fetchJson(`${apiBase}/items/${item._id}/claim`, {
            method: "PUT",
            headers: auth.headers,
          });
          showToast("Item reserved successfully.");
          card.remove();
          if (!browseContainer.querySelector(".passiton-card")) {
            browseContainer.innerHTML =
              "<p class='empty-state'>No items left to claim.</p>";
          }
        } catch (error) {
          showToast(error.message, "error");
        }
      });
      browseContainer.appendChild(card);
    });
  };

  searchInput.addEventListener("input", () => loadItems(searchInput.value));
  await loadItems();
};

window.initSearchPage = initSearchPage;
