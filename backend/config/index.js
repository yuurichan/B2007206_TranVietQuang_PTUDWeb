const config = {
	db: {
		string: process.env.DB_CONNECT_STRING || "mongodb://localhost:27017/QLyBanHang",
	},
	jwt: {
		ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access_token",
	},
};
module.exports = config;
