const router = require("express").Router();
let professional = require("../../controllers/professional.controller")

//Routes related to user actions of types temp-admin, staff, lecturer and student
router.post("/register", professional.createProfessional);
router.post("/get", professional.findProfessional);
router.get("/get/all", professional.findAllProfessional);
router.get("/get/all/verified", professional.findAllVerifiedProfessional);
router.post("/update", professional.updateProfessional);
router.post("/update/pass", professional.updatePassword);
router.post("/update/picture", professional.updatePicture);
router.post("/delete", professional.deleteProfessional);

module.exports = router;