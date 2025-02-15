const User = require('../models/User');
const { cloudinary, createUploader } = require('../utils/Cloudinary');
const upload = createUploader('users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Xử lý đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ message: 'Đăng nhập thành công!', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: err.message });
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
      fullname, email, password, role,
      contactEmail: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? contactEmail : undefined,
      contactPhone: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? contactPhone : undefined,
      farmName: role === 'Producer' ? farmName : undefined,
      farmLocation: role === 'Producer' ? farmLocation : undefined,
      companyName: (role === 'Transport' || role === 'Distributor') ? companyName : undefined,
      location: (role === 'Transport' || role === 'Distributor') ? location : undefined,
      registrationNumber: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? registrationNumber : undefined,
    });
    await user.save();
    res.status(200).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: err.message });
  }
};

// Cập nhật mật khẩu
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Mật khẩu đã được cập nhật' });
  } catch (err) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: err.message });
  }
};

//Lấy thông tin hồ sơ người dùng
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json({user});
  } catch (err) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: err.message });
  }
};

// Cập nhật hồ sơ người dùng
exports.updateUserProfile = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Lỗi khi upload hình ảnh.', error: err.message });
    }

    const { fullname, contactEmail, contactPhone, farmName, farmLocation, companyName, location, registrationNumber } = req.body;

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(400).json({  message: 'Không tìm thấy người dùng' });
      }

      if (req.file && user.image) {
        try {
          const publicId = user.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`users/${publicId}`);
        } catch (err) {
          console.error('Lỗi khi xóa ảnh cũ trên Cloudinary:', err);
        }
      }

      user.image = req.file?.path || user.image;
      user.fullname = fullname || user.fullname;

      if (user.role === 'Producer') {
        user.farmName = farmName || user.farmName;
        user.farmLocation = farmLocation || user.farmLocation;
      }

      if (user.role === 'Transport' || user.role === 'Distributor') {
        user.companyName = companyName || user.companyName;
        user.location = location || user.location;
      }

      if (['Producer', 'Transport', 'Distributor'].includes(user.role)) {
        user.contactEmail = contactEmail || user.contactEmail;
        user.contactPhone = contactPhone || user.contactPhone;
        user.registrationNumber = registrationNumber || user.registrationNumber;
      }

      await user.save();
      res.status(200).json({ message: 'Cập nhật hồ sơ thành công!', user });
    } catch (err) {
      res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: err.message });
    }
  });
};