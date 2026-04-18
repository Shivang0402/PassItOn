const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const itemController = require("../controllers/itemController.js");
const auth = require("../middleware/auth.js");

const uploadPath = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_.]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

const router = express.Router();

router.get("/", itemController.getAllItems);
router.get("/mine", auth, itemController.getMyItems);
router.get("/claimed", auth, itemController.getClaimedItems);
router.post("/", auth, upload.single("image"), itemController.createItem);
router.put("/:id", auth, upload.single("image"), itemController.updateItem);
router.put("/:id/claim", auth, itemController.claimItem);

module.exports = router;
