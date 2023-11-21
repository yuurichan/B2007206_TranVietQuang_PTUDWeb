const { dangnhap, xacthuc, dangkytk, doimk } = require("~/controllers/auth.controller");
const { authUser } = require("~/middlewares/authentication");

const router = require("express").Router();

router.route("/login").post(dangnhap);
router.route("/register").post(dangkytk);
router.route("/change-password").post(authUser, doimk);
router.route("/").get(xacthuc);

module.exports = router;
