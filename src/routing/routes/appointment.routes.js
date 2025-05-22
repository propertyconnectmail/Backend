const router = require("express").Router();
let appointment = require("../../controllers/appointment.controller")

//Routes related to user actions of types temp-admin, staff, lecturer and student
router.post("/create", appointment.createAppointment);
router.get("/get", appointment.getAllAppointments);
router.post("/get/client/appointments", appointment.getAllClientAppointments);
router.post("/get/professional/appointments", appointment.getAllProfessionalAppointments);
router.post("/get/appointment", appointment.getAppointment);
router.post("/update", appointment.updateAppointment);
router.post("/update/client/files", appointment.updateClientFiles);
router.post("/update/professional/files", appointment.updateProfessionalFiles);

module.exports = router;


 




