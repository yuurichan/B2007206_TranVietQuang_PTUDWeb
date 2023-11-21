require("module-alias/register");
require("dotenv").config();
const MongooseService = require("~/services/mongoose.service");
const khachhangModel = require("./models/khachhang.model");
const nhanvienModel = require("./models/nhanvien.model");
const PasswordUtil = require("./utils/password.util");

const rl = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

const readline = (message = "") => {
	return new Promise((resolve) => {
		rl.question(message, (line) => {
			resolve(line);
		});
	});
};
async function main() {
	await MongooseService.connectDB();

	let username = null;

	do {
		username = await readline("Username: ");

		const existingUser =
			(await khachhangModel.model.findOne({
				username,
			})) ||
			(await nhanvienModel.model.findOne({
				username,
			}));

		if (existingUser) {
			console.log("Username is already taken, try again!");
			username = null;
		}
	} while (!username);

	const password = await readline("Password: ");
	const ten = await readline("Ten: ");
	const chucvu = await readline("Chuc vu: ");
	const diachi = await readline("Dia chi: ");
	const sdt = await readline("Sdt: ");

	const hashedPassword = await PasswordUtil.hash(password);

	const newStaff = await nhanvienModel.model.create({
		username,
		password: hashedPassword,
		ten,
		chucvu,
		diachi,
		sdt,
	});

	console.log("Created new staff: ");
	console.table(newStaff.toObject());
}

main()
	.then(() => {
		console.log("Done");
	})
	.catch((error) => {
		console.log(error);
	})
	.finally(() => {
		process.exit(0);
	});
