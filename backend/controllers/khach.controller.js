const KhachHangModel = require("~/models/khachhang.model").model;
const DatHangModel = require("~/models/dathang.model").model;

class KhachController {
	async laymot(req, res) {
		try {
			const id = req.params.id;
			const khach = await KhachHangModel.findOne({ id });
			const donhangs = await DatHangModel.find({
				kh: {
					_id: khach._id,
				},
			});
			return res.status(200).json({ khach, donhangs });
		} catch (error) {
			return res.status(400).send({
				message: error.message,
			});
		}
	}

	async laytatca(req, res) {
		try {
			const page = req.query.page || 1;
			const pageSize = req.query.pageSize || null;
			const term = req.query.term || null;
			const searchBy = req.query.searchBy || null;
			const filter = {};
			if (term) {
				filter[searchBy] = {
					$regex: term,
					$options: "i",
				};
			}
			const allKhachs = await KhachHangModel.find(filter, "", {
				skip: page * pageSize - pageSize,
				limit: pageSize,
			});
			const totalRows = await KhachHangModel.count(filter);
			return res.status(200).json({
				totalRows,
				data: allKhachs,
			});
		} catch (error) {
			return res.status(400).send({
				message: error.message,
			});
		}
	}

	async xoa(req, res) {
		try {
			const id = req.params.id;
			const result = await KhachHangModel.deleteOne({
				id,
			});
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).send({
				message: error.message,
			});
		}
	}

	async tu_capnhat(req, res) {
		try {
			const currentUser = req.currentUser;

			const result = await KhachHangModel.findByIdAndUpdate(currentUser._id, req.body, { new: true });
			console.log(result);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).send({
				message: error.message,
			});
		}
	}

	async capnhat(req, res) {
		try {
			const id = req.params.id;
			const result = await KhachHangModel.updateOne(
				{
					id,
				},
				req.body
			);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new KhachController();
