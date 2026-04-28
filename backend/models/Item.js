const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "../assets/sheet container.avif" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "claimed", "received"],
      default: "available",
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimedByName: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", ItemSchema);
