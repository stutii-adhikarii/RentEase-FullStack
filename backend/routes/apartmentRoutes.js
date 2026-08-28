const express = require("express");
const apartmentController = require("../controller/apartmentController");
const { auth, requireLandlord } = require("../middleware/auth");

const router = express.Router();

router.get("/", apartmentController.getApartments);
router.get("/mine", auth, requireLandlord, apartmentController.getMyApartments);
router.get("/:id", apartmentController.getApartmentById);
router.post("/", auth, requireLandlord, apartmentController.createApartment);
router.put("/:id", auth, requireLandlord, apartmentController.updateApartment);
router.delete(
  "/:id",
  auth,
  requireLandlord,
  apartmentController.deleteApartment,
);

module.exports = router;
