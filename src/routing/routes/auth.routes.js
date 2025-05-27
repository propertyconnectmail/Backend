const router = require("express").Router();
let authRoutes = require("../../controllers/auth.controller")

//Route of login
router.post("/web", authRoutes.loginWebUser);
router.post("/mobile/client", authRoutes.loginMobileClient);
router.post("/mobile/professional", authRoutes.loginMobileProfessional);
router.post("/mobile/verification", authRoutes.sendVerificationCode);
router.post("/forgotpass", authRoutes.forgotPassword);
// router.post("/forgot/mobile", login.forgotMobileUser);
// router.get("/logout", login.logoutWebUser);

module.exports = router;