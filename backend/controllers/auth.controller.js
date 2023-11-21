const PasswordUtil = require("~/utils/password.util");
const TokenUtil = require("~/utils/token.util");

const NhanVienModel = require("~/models/nhanvien.model").model;
const KhachHangModel = require("~/models/khachhang.model").model;

class AuthController {
	async dangkytk(req, res) {
		try {
			const { password, username, ...rest } = req.body;
			const availableUser =
				(await KhachHangModel.findOne({ username })) || (await NhanVienModel.findOne({ username }));
			if (availableUser) 
				throw new Error("Tài Khoản Đã Tồn Tại");
			const hashedPassword = await PasswordUtil.hash(password);
			const newUser = new KhachHangModel({
				...rest,
				password: hashedPassword,
				username,
			});
			await newUser.save();

			const accessToken = TokenUtil.sign({
				...newUser.toJSON(),
				role: "khach",
			});

			return res.status(200).json({
				newUser,
				accessToken,
			});
		} 
		catch (error) {
			return res.status(500).send({ message: error.message });
		}
	}

	async dangnhap(req, res) {
		try {
			const { username, password } = req.body;
			
			// Tim trong KHModel trc
			let user = (await KhachHangModel.findOne({ username }))?.toObject();

			if (user) {
				user.role = "khach";
			} 
			else {
				user = (
					await NhanVienModel.findOne({
						username,
					})
				)?.toObject();

				if (user) {
					user.role = "nhanvien";
				}
			}

			if (!user) 
				throw new Error(`Không tồn tại tài khoản ${username}`);

			const isValidPassword = await PasswordUtil.compare(password, user.password);
			if (!isValidPassword) 
				throw new Error("Mật khẩu bị sai");

			// Mật khẩu và tài khoản đúng
			console.log(user);
			const accessToken = TokenUtil.sign(user);
			return res.status(200).json({ accessToken });
		} catch (error) {
			console.log(error);
			return res.status(500).send({ message: error.message });
		}
	}

	async xacthuc(req, res) {
		try {
			const authorization = req.headers.authorization;
			const decoded = TokenUtil.decode(authorization.replace("Bearer ", ""));
			const _id = decoded._id;
			let currentUser = await KhachHangModel.findById(_id);
			if (!currentUser) {
				currentUser = (await NhanVienModel.findById(_id)).toObject();
				currentUser.role = "nhanvien";
			}
			if (!currentUser) {
				throw new Error("Không tìm thấy người dùng");
			}
			return res.status(200).json(currentUser);
		} 
		catch (error) {
			return res.status(500).send({ message: error.message });
		}
	}

	async doimk(req, res) {
		try {
			const currentUser = req.currentUser;
			const { newPassword, password } = req.body;
			if (!PasswordUtil.compare(password, currentUser.password)) 
				throw new Error("Mật khẩu không đúng");
			
			if (currentUser.role === "khach") {
				await KhachHangModel.findByIdAndUpdate(currentUser._id, {
					password: PasswordUtil.hash(newPassword),
				});
			} 
			else {
				await NhanVienModel.findByIdAndUpdate(currentUser._id, {
					password: PasswordUtil.hash(newPassword),
				});
			}
			return res.status(200).json({ message: "Đổi mật khẩu thành công" });
		} catch (error) {
			console.log(error);
			return res.status(500).send({ message: error.message });
		}
	}
}

module.exports = new AuthController();
