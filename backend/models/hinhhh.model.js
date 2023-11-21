const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const HinhHH = new mongoose.Schema({
	id: {
		type: Number,
	},
	ten: {
		type: String,
	},
	path: {
		type: String,
		required: true,
	},
},
{
	timestamps: true,
}
);

autoIncrement.plugin(HinhHH, {
	model: "HinhHH",
	field: "id",
	startAt: 1000,
});

module.exports = {
	schema: HinhHH,
	model: mongoose.model("HinhHH", HinhHH),
};
