const jwt = require("jsonwebtoken");
const config = require("~/config");
const TokenUtil = {
	sign(data) {
		return jwt.sign(data, config.jwt.ACCESS_TOKEN_SECRET);
	},
	decode(token) {
		return jwt.decode(token, config.jwt.ACCESS_TOKEN_SECRET);
	},
};

module.exports = TokenUtil;
