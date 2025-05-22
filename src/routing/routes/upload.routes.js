const router = require("express").Router();

const multer = require('../../middlewares/multerMiddleware');
let upload = require("../../controllers/upload.controller")

//Routes related to user actions of types temp-admin, staff, lecturer and student
router.post("/create", multer.uploadSingleImage, upload.createUpload);
router.post("/certification", multer.uploadCertifications, upload.createCertificationUpload);
router.post("/multipleType", multer.uploadDocumentsAndImages, upload.createDocumentAndImageUpload);


//router.post("/update", multer.uploadMany ,upload.updateUpload);

module.exports = router;