const router = require("express").Router();
const { updateProfile, authenticate } = require("../controllers/profile.controlllers");
const { image } = require("../libs/multer");
const {restrict} = require("../middlewares/auth.middlewares");

router.put("/update", restrict, image.single("image"), updateProfile);
router.get("/authenticate", restrict, authenticate);

module.exports = router;
