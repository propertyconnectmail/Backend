const router = require("express").Router();
let registryLocation = require("../../controllers/registryLocation.controller")

router.post("/register", registryLocation.registryLocationRegister);
router.post("/get", registryLocation.findRegistryLocation);
router.get("/get/all", registryLocation.finalAllRegistryLocation);
router.post("/update", registryLocation.updateRegistryLocation);
router.post("/delete", registryLocation.deleteRegistryLocation);

module.exports = router;