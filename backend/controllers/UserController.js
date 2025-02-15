const User = require('../models/User');

const Category = require('../models/Category');
const Product = require('../models/Product');
const Process = require('../models/Process');
const Region = require('../models/Region');
const Harvest = require('../models/Harvest');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Inbound = require('../models/Inbound');
const Outbound = require('../models/Outbound');
const Retailer = require('../models/Retailer');

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
        if (!users || users.length === 0) {
            return res.status(400).json({ message: 'Không có người dùng nào.' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Thêm user mới
exports.createUser = async (req, res) => {
    try {
        const { fullname, email, role } = req.body;

        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const password = email.split('@')[0];
        const newUser = new User({ fullname, email, password, role });
        await newUser.save();
        res.status(200).json({ message: 'Người dùng mới được tạo thành công.', newUser });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
    try {
        const existingUserByEmail = await User.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống.' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công.', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Xóa user
exports.deleteUser = async (req, res) => {
    try {
        const user =  await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy người dùng.' });
        }
        
        const hasCategory = await Category.exists({ userID: req.params.id });
        const hasProduct = await Product.exists({ userID: req.params.id });
        const hasProcess = await Process.exists({ userID: req.params.id });
        const hasRegion = await Region.exists({ userID: req.params.id });
        const hasHarvest = await Harvest.exists({ userID: req.params.id });
        const hasVehicle = await Vehicle.exists({ userID: req.params.id });
        const hasDriver = await Driver.exists({ userID: req.params.id });
        const hasRoute = await Route.exists({ userID: req.params.id });
        const hasInbound = await Inbound.exists({ userID: req.params.id });
        const hasOutbound = await Outbound.exists({ userID: req.params.id });
        const hasRetailer = await Retailer.exists({ userID: req.params.id });
        
        if ( hasCategory || hasProduct || hasProcess || hasRegion || hasHarvest || hasVehicle || hasDriver || hasRoute || hasInbound || hasOutbound || hasRetailer ) {
            return res.status(400).json({
                message: `Không thể xóa vì người dùng này đã tham gia hoạt động: ${
                    [
                        hasCategory && 'Quản Lý Phân Loại',
                        hasProduct && 'Quản Lý Sản Phẩm',
                        hasProcess && 'Quản Lý Quy Trình Sản Xuất',
                        hasRegion && 'Quản Lý Vùng Sản Xuất',
                        hasHarvest && 'Quản Lý Thu Hoạch',
                        hasVehicle && 'Quản Lý Tài Xế',
                        hasDriver && 'Quản Lý Phương Tiện',
                        hasRoute && 'Quản Lý Lộ Trình',
                        hasInbound && 'Quản Lý Nhập Kho',
                        hasOutbound && 'Quản Lý Xuất Kho',
                        hasRetailer && 'Quản Lý Nhà Bán Lẻ'
                    ].filter(Boolean).join(', ')
                }.`
            });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Người dùng đã xóa thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Cấp lại mật khẩu cho User -> Admin
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ fullname: req.body.fullname });
        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại.' });
        }

        user.password = convertToSlug(user.fullname);
        await user.save();
        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Lấy danh sách tất cả Producer
exports.getAllProducers = async (req, res) => {
    try {
        const producers = await User.find({ role: 'Producer' });
        if (!producers || producers.length === 0) {
            return res.status(400).json({ message: 'Không có nhà sản xuẩt nào.' });
        }
        res.status(200).json(producers);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Lấy danh sách tất cả Transport
exports.getAllTransports = async (req, res) => {
    try {
        const transports = await User.find({ role: 'Transport' });
        if (!transports || transports.length === 0) {
            return res.status(400).json({ message: 'Không có nhà vận chuyển nào.' });
        }
        res.status(200).json(transports);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};