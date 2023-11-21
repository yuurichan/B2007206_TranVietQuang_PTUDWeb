const express = require("express");
const router = express.Router();

router.get("", (req, res) => {
	res.render("index.html");
});
router.use("/auth", require("./auth.route"));
router.use("/khach", require("./khachhang.route"));
router.use("/nhanvien", require("./nhanvien.route"));
router.use("/hanghoa", require("./hanghoa.route"));
router.use("/dathang", require("./dathang.route"));

module.exports = router;
