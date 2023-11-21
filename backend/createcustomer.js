require("module-alias/register");
require("dotenv").config();
const MongooseService = require("~/services/mongoose.service");
const khachhangModel = require("./models/khachhang.model");
const PasswordUtil = require("./utils/password.util");
const { faker } = require("@faker-js/faker");

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

	const numberOfCustomers = Number(await readline("Number of customers: "));

	if (isNaN(numberOfCustomers)) {
		console.log("Invalid number");
		process.exit(0);
	}

	for (let i = 0; i < numberOfCustomers; i++) {
		const newCustomer = await khachhangModel.model.create({
			ten: faker.name.fullName(),
			diachi: faker.address.streetAddress(),
			sdt: "0345678912",
			username: faker.internet.userName(),
			password: await PasswordUtil.hash(faker.internet.password()),
		});

		console.table(newCustomer.toObject());
	}
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
