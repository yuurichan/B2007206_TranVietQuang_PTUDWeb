const HangHoaController = require("~/controllers/hanghoa.controller");
const { authUser, authAdmin } = require("~/middlewares/authentication");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: path.resolve(__dirname, "../uploads/images") });

const router = require("express").Router();

router.route("/:idHangHoa/hinh").post(authUser, authAdmin, upload.single("image"), HangHoaController.themhinh);
router.route("/:idHangHoa/hinh/:id").delete(authUser, authAdmin, HangHoaController.xoahinh);

router.route("/").get(HangHoaController.laytatca).post(authUser, authAdmin, HangHoaController.them);
router.route("/ids/:ids").get(HangHoaController.getByIds);
router.route("/:id").get(HangHoaController.laymot).put(authUser, authAdmin, HangHoaController.capnhat).delete(authUser, authAdmin, HangHoaController.xoa);

module.exports = router;
