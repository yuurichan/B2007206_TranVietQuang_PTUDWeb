const TokenUtil = require("~/utils/token.util");
const KhachHangModel = require("~/models/khachhang.model").model;
const NhanVienModel = require("~/models/nhanvien.model").model;

class AuthenticationMiddleWares {
	async authUser(req, res, next) {
		try {
			const authorization = req.headers.authorization;
			if (!authorization) 
				throw new Error("Yêu cầu access token để tiếp tục");

			const accessToken = String(authorization).replace("Bearer ", "");
			if (!accessToken) 
				throw new Error("Access token không hợp lệ");

			const decodedUser = TokenUtil.decode(accessToken);
			if (!decodedUser) 
				throw new Error("Access token không hợp lệ");
			const { id, role } = decodedUser;

			let currentUser;
			switch (role) {
				case "khach":
					currentUser = (await KhachHangModel.findOne({ id })).toJSON();
					req.currentUser = {
						...currentUser,
						role: "khach",
					};
					break;
				case "nhanvien":
					currentUser = (await NhanVienModel.findOne({ id })).toJSON();
					req.currentUser = {
						...currentUser,
						role: "nhanvien",
					};

					req.currentUser = currentUser;
					break;
				default:
					throw new Error("Access token không hợp lệ");
			}
			next();
		} 
		catch (error) {
			console.log(error);
			return res.status(500).json({ message: error.message });
		}
	}

	authAdmin(req, res, next) {
		try {
			const currentUser = req.currentUser;
			if (currentUser.role === "khach") throw new Error("Truy cập bị từ chối");
			next();
		}
		catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}
}

module.exports = new AuthenticationMiddleWares();
