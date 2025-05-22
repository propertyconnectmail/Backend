const router = require("express").Router();
let employee = require("../../controllers/employee.controller")

//Routes related to user actions of types temp-admin, staff, lecturer and student
router.post("/register", employee.employeeRegister);
router.post("/get", employee.findEmployee);
router.get("/get/all", employee.findAllEmployees);
router.post("/update", employee.updateEmployee);
router.post("/update/pass", employee.updateEmployeePassword);
router.post("/update/picture", employee.updatePicture);
router.post("/delete", employee.deleteEmployee);

module.exports = router;