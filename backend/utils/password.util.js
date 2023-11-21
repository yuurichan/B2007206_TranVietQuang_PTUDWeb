const bcrypt = require("bcryptjs");
const PasswordUtil = {
	hash(data) {
		const saltRounds = 10;
		return bcrypt.hashSync(data, saltRounds);
	},

	compare(password, hash) {
		return bcrypt.compareSync(password, hash);
	},
};

module.exports = PasswordUtil;
