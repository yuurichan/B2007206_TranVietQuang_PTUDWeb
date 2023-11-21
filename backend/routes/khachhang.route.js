const { laytatca, xoa, tu_capnhat, capnhat, laymot } = require("~/controllers/khach.controller");
const { authUser, authAdmin } = require("~/middlewares/authentication");

const router = require("express").Router();

router.route("/").get(authUser, authAdmin, laytatca).put(authUser, tu_capnhat);
router.route("/:id").get(authUser, laymot).put(authUser, authAdmin, capnhat).delete(authUser, authAdmin, xoa);

module.exports = router;
