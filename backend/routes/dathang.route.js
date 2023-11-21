const DatHangController = require("~/controllers/dathang.controller");
const { authUser, authAdmin } = require("~/middlewares/authentication");

const router = require("express").Router();

router.route("/").get(authUser, authAdmin, DatHangController.laytatca).post(authUser, DatHangController.dathang);
router.route("/chitiet/:id").put(authUser, authAdmin, DatHangController.capnhatchitiet).delete(authUser, authAdmin, DatHangController.xoachitiet);
router.route("/:id").get(authUser, DatHangController.laymot).put(authUser, authAdmin, DatHangController.capnhat).delete(authUser, authAdmin, DatHangController.xoa);

module.exports = router;
