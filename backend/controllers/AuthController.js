const User = require('../models/User');

const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Xử lý đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
        res.json({ token, user });
        console.log({ token, user })
    } catch (err) {
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
};

// Xử lý đăng ký
exports.register = async (req, res) => { 
    const { fullname, email, password, role, contactEmail, contactPhone, farmName, farmLocation, companyName, location, registrationNumber } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        const user = new User({
            fullname,
            email,
            password,
            role,
            contactEmail: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? contactEmail : undefined,
            contactPhone: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? contactPhone : undefined,
            farmName: role === 'Producer' ? farmName : undefined,
            farmLocation: role === 'Producer' ? farmLocation : undefined,
            companyName: (role === 'Transport' || role === 'Distributor') ? companyName : undefined,
            location: (role === 'Transport' || role === 'Distributor') ? location : undefined,
            registrationNumber: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? registrationNumber : undefined,
        });

        console.log(user)
        await user.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        console.log(err)
        console.error(err);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.' });
    }
};

// Cập nhật mật khẩu
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Mật khẩu đã được cập nhật' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

//Lấy thông tin hồ sơ người dùng
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../frontend/public/assets/user'));
    },
    filename: function (req, file, cb) {
        const fileName = `avatar-${req.userId}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

// Cập nhật hồ sơ người dùng
exports.updateUserProfile = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Lỗi khi upload hình ảnh.', error: err.message });
        }
        const userId = req.userId;
        const { fullname, contactEmail, contactPhone, farmName, farmLocation, companyName, location, registrationNumber } = req.body;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
            }

            const image = req.file ? `/assets/user/${req.file.filename}` : null;
            if (image && user.image && image !== user.image) {
                const oldImagePath = path.join(__dirname, '../../frontend/public', user.image || '');
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Lỗi khi xóa ảnh cũ:', err);
                });
            }
            if (image) {
                user.image = image;
            }

            user.fullname = fullname || user.fullname;

            if (user.role === 'Producer') {
                user.farmName = farmName || user.farmName;
                user.farmLocation = farmLocation || user.farmLocation;
            }

            if (user.role === 'Transport' || user.role === 'Distributor') {
                user.companyName = companyName || user.companyName;
                user.location = location || user.location;
            }

            if (user.role === 'Producer' || user.role === 'Transport' || user.role === 'Distributor') {
                user.contactEmail = contactEmail || user.contactEmail;
                user.contactPhone = contactPhone || user.contactPhone;
                user.registrationNumber = registrationNumber || user.registrationNumber;
            }

            await user.save();

            res.status(200).json({
                success: true,
                message: 'Cập nhật hồ sơ thành công!',
                user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    });
};