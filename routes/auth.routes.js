const { register, login, whoami } = require("../controllers/auth.controllers");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/whoami", whoami);


module.exports = router;