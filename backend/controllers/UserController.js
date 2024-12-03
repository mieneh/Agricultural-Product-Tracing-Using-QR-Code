const User = require('../models/User');

const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, '');
};

// Lấy danh sách user
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "Admin" } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm user mới
exports.createUser = async (req, res) => {
    try {
        const { fullname, email } = req.body;

        const existingUser = await User.findOne({ fullname });
        if (existingUser) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const newUser = new User(req.body);
        await newUser.save();
        console.log(newUser)
        res.status(201).json({ message: 'Người dùng mới được tạo thành công.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
    try {
        const { fullname, email } = req.body;

        const existingUserByFullname = await User.findOne({fullname, _id: { $ne: req.params.id }});
        if (existingUserByFullname) {
            return res.status(400).json({ message: 'Tên người dùng đã tồn tại trong hệ thống.' });
        }

        const existingUserByEmail = await User.findOne({email, _id: { $ne: req.params.id }});
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống.' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(updatedUser)
        res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Người dùng đã xóa thành công.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cấp lại mật khẩu cho User -> Admin
exports.resetPassword = async (req, res) => {
    const { fullname } = req.body;
  
    try {
        const user = await User.findOne({ fullname });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }

        const newPassword = convertToSlug(user.fullname);
        user.password = newPassword;
        await user.save();
    
        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đặt lại mật khẩu' });
    }
};

// Lấy danh sách tất cả Producer
exports.getAllProducers = async (req, res) => {
    try {
        const producers = await User.find({ role: 'Producer' });
        res.status(200).json(producers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách tất cả Transport
exports.getAllTransports = async (req, res) => {
    try {
        const transports = await User.find({ role: 'Transport' });
        res.status(200).json(transports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};