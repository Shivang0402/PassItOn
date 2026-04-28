const Item = require("../models/Item.js");

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load items." });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load your listings." });
  }
};

exports.getClaimedItems = async (req, res) => {
  try {
    const items = await Item.find({ claimedBy: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load claimed items." });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ message: "Title, description, and price are required." });
    }

    let imageUrl = "../assets/sheet container.avif";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const item = await Item.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      imageUrl,
      owner: req.user.id,
      ownerName: req.user.name || "Unknown User",
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message || "Unable to add item." });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { title, description, price, status } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    if (item.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own items." });
    }

    if (status) {
      if (status === "received") {
        if (item.status !== "claimed") {
          return res
            .status(400)
            .json({ message: "Only claimed items can be marked received." });
        }
        item.status = "received";
      } else {
        return res.status(400).json({ message: "Invalid status update." });
      }
    }

    item.title = title ? title.trim() : item.title;
    item.description = description ? description.trim() : item.description;
    item.price = price ? Number(price) : item.price;
    if (req.file) {
      item.imageUrl = `/uploads/${req.file.filename}`;
    }
    await item.save();
    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update item." });
  }
};

exports.claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    if (item.status !== "available") {
      return res.status(400).json({ message: "This item cannot be claimed." });
    }
    if (item.owner.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot claim your own item." });
    }

    item.status = "claimed";
    item.claimedBy = req.user.id;
    item.claimedByName = req.user.name || "Unknown User";
    await item.save();
    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to claim item." });
  }
};
