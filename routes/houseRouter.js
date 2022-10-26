const router = require('express').Router();
const houseController = require('../controllers/houseController');
const {checkToken} = require("../middlewares/validateToken");

router.get("/search", checkToken, houseController.searching);

router.get("/appointments", checkToken, houseController.getAllAppointments);

router.get("/:id", checkToken, houseController.getHouseById);

router.patch("/:id", checkToken, houseController.edit);

router.post("/", checkToken, houseController.add);

router.patch("/:id/createAppointment", checkToken, houseController.createAppointment)

module.exports = router;