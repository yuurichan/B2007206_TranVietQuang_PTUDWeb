const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const MongooseService = require("~/services/mongoose.service");

const HangHoa = new mongoose.Schema({
	id: {
		type: Number,
	},
	ten: {
		type: String,
		required: true,
	},
	mota: {
		type: String,
		required: true,
	},
	gia: {
		type: Number,
		required: true,
	},
	soluong: {
		type: Number,
		required: true,
		default: 0,
	},
	ghichu: {
		type: String,
	},
	isDeleted: {
		type: Boolean,
		required: true,
		default: false,
	},
	images: {
		type: Array,
		required: true,
		default: [],
	},
},
{
	timestamps: true,
}
);

MongooseService.setupSoftDelete(HangHoa);
autoIncrement.plugin(HangHoa, {
	model: "HangHoa",
	field: "id",
	startAt: 1000,
});

module.exports = {
	schema: HangHoa,
	model: mongoose.model("HangHoa", HangHoa),
};
