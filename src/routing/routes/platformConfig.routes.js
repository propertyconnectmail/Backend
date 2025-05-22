const router = require("express").Router();
let platform = require("../../controllers/platformConfig.controller")

//Routes related to user actions of types temp-admin, staff, lecturer and student
router.post("/create", platform.createPlatformConfig);
router.post("/get", platform.findPlatformConfig);
router.post("/update/professional", platform.updateTotalProfessionals);
router.post("/update/client", platform.updateTotalClients);
router.post("/update/revenue", platform.updateTotalRevenue);
router.post("/update/appointment", platform.updateTotalAppointments);
router.post("/update/maintainance", platform.updateMaintainanceMode);

module.exports = router;