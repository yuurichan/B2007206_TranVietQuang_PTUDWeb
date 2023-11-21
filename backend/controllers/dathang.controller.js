const DatHangModel = require("~/models/dathang.model").model;
const HangHoaModel = require("~/models/hanghoa.model").model;
const KhachHangModel = require("~/models/khachhang.model").model;
const ChiTietDatHangModel = require("~/models/chitietdathang.model").model;

class DatHangController {
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

			if (searchBy?.startsWith("kh.") && term) {
				const filterKhachHang = searchBy.split(".")[1];
				const khachs = await KhachHangModel.find({ [filterKhachHang]: { $regex: term, $options: "i" } });
				const khachIds = khachs.map((kh) => kh._id);
				delete filter[searchBy];
				filter.kh = { $in: khachIds };
			}
			console.log(filter);
			const allDatHangs = await DatHangModel.find(filter, "", {
				skip: (page - 1) * (pageSize || 0),
				limit: !pageSize || page * pageSize,
				populate: [
					{
						path: "kh",
						select: "ten diachi",
					},
					{
						path: "nv",
						select: "ten",
					},
				],
			});

			const totalRows = await DatHangModel.count(filter);
			return res.status(200).json({
				total: totalRows,
				data: allDatHangs,
			});
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}

	async laymot(req, res) {
		try {
			const id = req.params.id;
			const dathang = await DatHangModel.findById(id)
				.populate("kh", "ten diachi sdt")
				.populate("nv", "ten diachi sdt")
				.populate({
					path: "chitiets",
					model: "ChiTietDatHang",
					populate: {
						path: "hanghoa",
						model: "HangHoa",
						select: "ten gia soluong images",
					},
				});
			if (!dathang) {
				return res.status(404).json({
					message: "Không tìm thấy đơn hàng",
				});
			}
			console.log(dathang);
			const tongtien = dathang.chitiets.reduce((acc, chitiet) => {
				// Added discount calculation (latter half of this return part)
				return acc + chitiet.gia * chitiet.soluong - (chitiet?.giamgia || 0) * chitiet.soluong;
			}, 0);
			dathang.tongtien = tongtien;
			return res.status(200).json({ data: dathang, tongtien });
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}

	async dathang(req, res) {
		try {
			const currentUser = req.currentUser;
			if (!currentUser) {
				throw new Error("Bạn chưa đăng nhập");
			}
			if (currentUser.role !== "khach") {
				throw new Error("Bạn không phải là khách hàng");
			}
			const { chitiets, ...info } = req.body;
			const newDatHang = new DatHangModel({
				...info,
				ngayDH: new Date(),
				kh: currentUser._id,
			});
			const hhMap = new Map();
			// Validate
			for (const chitiet of chitiets) {
				const mahh = chitiet.mahh;
				const hanghoa = await HangHoaModel.findById(mahh);
				hhMap.set(mahh, hanghoa);
				if (!hanghoa) {
					throw new Error("Hàng hóa không tồn tại");
				}
				if (hanghoa.soluong < chitiet.soluong) {
					throw new Error(`${hanghoa.ten} chỉ còn ${hanghoa.soluong} sản phẩm}`);
				}
			}
			// Persist Data
			const savedDatHang = (await newDatHang.save()).toObject();
			console.log(savedDatHang);
			const chiTietRecords = [];
			for (const chitiet of chitiets) {
				const hanghoa = hhMap.get(chitiet.mahh);
				const newChiTietDatHang = new ChiTietDatHangModel({
					...chitiet,
					gia: hanghoa.gia,
					dh: savedDatHang._id,
					hanghoa: hanghoa._id,
				});
				const newChiTiet = await newChiTietDatHang.save();
				chiTietRecords.push(newChiTiet);
				await HangHoaModel.findByIdAndUpdate(chitiet.mahh, {
					$inc: {
						soluong: -chitiet.soluong,
					},
				});
			}
			await DatHangModel.findByIdAndUpdate(savedDatHang._id, {
				$push: {
					chitiets: chiTietRecords,
				},
			});

			return res.status(200).json({ message: "Đặt hàng thành công" });
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}

	async capnhat(req, res) {
		try {
			const currentUser = req.currentUser;
			const id = req.params.id;
			delete req.body.chitiets;
			delete req.body.ngayDH;
			delete currentUser.role;
			const newDatHang = await DatHangModel.findByIdAndUpdate(
				id,
				{ ...req.body, nv: currentUser },
				{ new: true }
			);
			return res.status(200).json(newDatHang);
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}

	async capnhatchitiet(req, res) {
		try {
			const id = req.params.id;
			const newChiTiet = await ChiTietDatHangModel.findOneAndUpdate({ id }, req.body, { new: true });
			return res.status(200).json(newChiTiet);
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}

	async xoachitiet(req, res) {
		try {
			const id = req.params.id;
			const newChiTiet = await ChiTietDatHangModel.findOneAndDelete({ id }, { returnDocument: true });
			console.log(newChiTiet);
			await DatHangModel.findOneAndUpdate(
				{ id: newChiTiet.dh },
				{
					$pull: {
						chitiets: newChiTiet._id,
					},
				}
			);
			return res.status(200).json(newChiTiet);
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}

	async xoa(req, res) {
		try {
			const result = await DatHangModel.findByIdAndDelete(req.params.id);
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	}
}
module.exports = new DatHangController();
