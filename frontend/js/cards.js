const buildItemCard = (item, currentUserId, onClaim) => {
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
        <div class="passiton-price"><i class="fa-solid fa-tag"></i> ₹${item.price}</div>
      </div>
    </div>
  `;

  const priceButtonRow = card.querySelector(".passiton-price-button");
  const actionButton = document.createElement("button");
  const isOwner = String(item.owner) === String(currentUserId);
  const isAvailable = item.status === "available";

  if (isOwner) {
    actionButton.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Reserve';
    actionButton.disabled = true;
    actionButton.title = "You cannot reserve your own item.";
  } else if (isAvailable) {
    actionButton.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Reserve';
    actionButton.type = "button";
    actionButton.addEventListener("click", () => onClaim(item));
  } else {
    actionButton.innerHTML = '<i class="fa-solid fa-check"></i> Claimed';
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
        ? `<button type="button" class="account-action-btn account-receive-btn"><i class="fa-solid fa-handshake"></i> Mark received</button>`
        : item.status === "received"
          ? `<button type="button" class="account-action-btn account-received-btn" disabled><i class="fa-solid fa-check"></i> Received</button>`
          : `<button type="button" class="account-action-btn account-edit-btn"><i class="fa-solid fa-pen-to-square"></i> Edit</button>`
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
        <span><i class="fa-solid fa-tag"></i> ₹${item.price}</span>
        <span><i class="fa-solid fa-box"></i> ${item.status}</span>
        ${isClaimedSection ? `<span><i class="fa-solid fa-user"></i> Owner: ${item.ownerName}</span>` : ""}
        ${item.claimedByName ? `<span><i class="fa-solid fa-user-check"></i> Claimed by: ${item.claimedByName}</span>` : ""}
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

window.buildItemCard = buildItemCard;
window.buildProfileListItem = buildProfileListItem;
