const router = require('express').Router();
const profileController = require('../controllers/profileController');
const {checkToken} = require("../middlewares/validateToken");

router.get("/profile", checkToken, profileController.getByUserId);

router.post("/register",profileController.add);

module.exports = router;