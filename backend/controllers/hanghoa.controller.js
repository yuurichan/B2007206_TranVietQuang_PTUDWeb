const HangHoaModel = require("~/models/hanghoa.model").model;
const HinhHHModel = require("~/models/hinhhh.model").model;
const fs = require("fs");
const path = require("path");

class HangHoaController {
	async laytatca(req, res) {
        try {
            const page = req.query.page || 0;
            const pageSize = req.query.pageSize || null;
            const term = req.query.term || null;
            const searchBy = req.query.searchBy || null;
            const sortBy = req.query.sortBy || null;
            const direction = req.query.direction || null;
            const filter = {};
            const sort = {};
            if (sortBy) {
                sort[sortBy] = direction;
            }
            if (term) {
                if (searchBy === "gia" || searchBy === "soluong") {
                    filter[searchBy] = +term;
                } else {
                    filter[searchBy] = {
                        $regex: term,
                        $options: "i",
                    };
                }
            }
            const allHangHoas = await HangHoaModel.find(filter, "", {
                skip: (page - 1) * (pageSize || 0),
                limit: !pageSize || page * pageSize,
            })
                .populate("images")
                .sort(sort);

            const totalRows = await HangHoaModel.count(filter);
            return res.status(200).json({
                totalRows,
                data: allHangHoas,
            });
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    }

	async laymot(req, res) {
		try {
			const id = req.params.id;
			const hanghoa = await HangHoaModel.findOne({ id });

			if (!hanghoa) {
				return res.status(404).json({
					message: "Không tìm thấy hàng hóa",
				});
			}
			return res.status(200).json(hanghoa);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}

	async them(req, res) {
		try {
			const hanghoa = new HangHoaModel({
				...req.body,
				images: [],
			});
			await hanghoa.save();
			return res.status(201).json(hanghoa);
		} catch (error) {
			return res.status(400).send({
				message: error.message,
			});
		}
	}

	async themhinh(req, res) {
		try {
			const image = req.file;
			const id = req.params.idHangHoa;

			const path = `public/images/${image.filename}`;

			const hinh = await HinhHHModel.create({
				path,
				ten: image.originalname,
			});
			console.log(hinh);
			const result = await HangHoaModel.updateOne(
				{ id },
				{
					$push: {
						images: hinh,
					},
				}
			);
			console.log(result);
			return res.status(201).json(hinh.toObject());
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}

	async xoahinh(req, res) {
		try {
			const idHangHoa = +req.params.idHangHoa;
			const id = +req.params.id;

			const hinh = await HinhHHModel.findOneAndDelete({ id }, { returnOriginal: true });

			await HangHoaModel.updateOne(
				{
					id: idHangHoa,
				},
				{
					$pull: {
						images: { id },
					},
				},
				{ returnOriginal: true }
			);

			if (hinh) {
				fs.unlinkSync(path.resolve(__dirname, "../uploads/images", hinh.path.split("/")[2]));
			}

			return res.status(200).end();
		} catch (error) {
			console.log(error);
			return res.status(400).json({ message: error.message });
		}
	}

	async capnhat(req, res) {
		try {
			delete req.body.images;
			const id = req.params.id;
			const result = await HangHoaModel.updateOne(
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

	async xoa(req, res) {
		try {
			const id = req.params.id;

			const result = await HangHoaModel.deleteOne({
				id,
			});
			return res.status(200).json(result);
		} catch (error) {
			return res.status(400).send({
				message: error.message,
			});
		}
	}

	async getByIds(req, res) {
		try {
			const ids = req.params.ids.split(",");

			const hanghoa = await HangHoaModel.find({
				id: {
					$in: ids,
				},
			});

			res.status(200).json(hanghoa);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new HangHoaController();
