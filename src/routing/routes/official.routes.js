const router = require("express").Router();
let official = require("../../controllers/official.controller")

router.post("/register", official.officialRegister);
router.post("/get", official.findOfficial);
router.get("/get/all", official.finalAllOfficials);
router.post("/update", official.updateOfficial);
router.post("/delete", official.deleteOfficial);

module.exports = router;