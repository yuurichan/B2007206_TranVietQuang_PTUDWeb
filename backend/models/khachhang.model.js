/* eslint-disable valid-typeof */
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const MongooseService = require("~/services/mongoose.service");

const KhachHang = new mongoose.Schema({
	id: {
		type: Number,
	},
	ten: {
		type: String,
		required: true,
	},
	sdt: {
		type: String,
		required: true,
		validate: {
			validator: function isVietnamesePhoneNumberValid(number) {
				return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
			},
			message: () => "Số điện thoại không hợp lệ",
		},
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	diachi: {
		type: String,
		required: true,
	},
	isDeleted: {
		type: Boolean,
		required: true,
		default: false,
	},
},
{
	timestamps: true,
}
);

MongooseService.setupSoftDelete(KhachHang);
autoIncrement.initialize(mongoose.connection);
KhachHang.plugin(autoIncrement.plugin, {
	model: "KhachHang",
	field: "id",
	startAt: 1000,
});

module.exports = {
	schema: KhachHang,
	model: mongoose.model("KhachHang", KhachHang),
};
