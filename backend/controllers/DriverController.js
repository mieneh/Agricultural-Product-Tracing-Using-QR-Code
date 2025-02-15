const Driver = require('../models/Driver');
const Route = require('../models/Route');

// Lấy danh sách tài xế
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ userID: req.userId });
    if (!drivers || drivers.length === 0) {
      return res.status(400).json({ message: 'Không có tài xế nào.' });
    }
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm tài xế
exports.createDriver = async (req, res) => {
  try {
    const { name, sdt, GPLX } = req.body;

    const existingDriver = await Driver.findOne({ GPLX: GPLX, userID: req.userId });
    if (existingDriver) {
      return res.status(400).json({ message: 'Giấy phép lái xe này đã tồn tại.' });
    }

    const driver = new Driver({ name, sdt, GPLX, userID: req.userId });
    await driver.save();
    res.status(200).json({ message: 'Thông tin tài xế đã được thêm thành công.', driver });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật tài xế
exports.updateDriver = async (req, res) => {
  try {
    const { GPLX, ...updates } = req.body;

    const driver = await Driver.findOne({ _id: req.params.id, userID: req.userId });
    if (!driver) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin tài xế hoặc quyền truy cập bị từ chối' });
    }

    if (GPLX !== driver.GPLX) {
      const existingDriver = await Driver.findOne({ GPLX: GPLX, userID: req.userId, _id: { $ne: req.params.id }});
      if (existingDriver) {
        return res.status(400).json({ message: 'Giấy phép lái xe này đã tồn tại.' });
      }
    }
    
    const updatedDriver = await Driver.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      {...updates, GPLX: GPLX},
      { new: true }
    );
    res.status(200).json({ message: 'Thông tin tài xế đã cập nhật thành công.', updatedDriver });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa tài xế
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOne({ _id: req.params.id, userID: req.userId });
    if (!driver) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin tài xế hoặc quyền truy cập bị từ chối' });
    }

    const route = await Route.findOne({ driverID: req.params.id, userID: req.userId });
    if (route) {
      return res.status(400).json({ message: 'Không thể tài xế này vì đã có thông tin trong lộ trình vận chuyển.' });
    }

    await Driver.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Thông tin tài xế đã xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};