const router = require("express").Router();
let auditLog = require("../../controllers/auditLog.controller")

//Routes related to user actions of types temp-admin, staff, lecturer and student
router.post("/create", auditLog.createAuditLog);
router.get("/get/all", auditLog.findAllAuditLogs);

module.exports = router;