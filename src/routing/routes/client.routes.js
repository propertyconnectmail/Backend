const router = require("express").Router();
let client = require("../../controllers/client.controller")

//Routes related to user actions of types temp-admin, staff, lecturer and student
router.post("/register", client.clientRegister);
router.post("/get", client.findClient);
router.get("/get/all", client.findAllClients);
router.post("/update", client.updateClient);
router.post("/update/pass", client.updatePassword);
router.post("/update/picture", client.updatePicture);
router.post("/delete", client.deleteClient);

router.post("/add/card", client.addCard);
router.post("/update/card", client.updateCard);
router.post("/delete/card", client.deleteCard);
router.post("/get/all/cards", client.getCards);
router.post("/get/card", client.getCard);

module.exports = router;