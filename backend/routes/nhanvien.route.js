const { laymot, laytatca } = require("~/controllers/nhanvien.controller");

const router = require("express").Router();

router.route("/").get(laytatca);
router.route("/:id").get(laymot);
module.exports = router;
