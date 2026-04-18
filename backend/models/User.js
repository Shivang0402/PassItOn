const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
