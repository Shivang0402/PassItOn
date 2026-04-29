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

window.initListItemPage = initListItemPage;
