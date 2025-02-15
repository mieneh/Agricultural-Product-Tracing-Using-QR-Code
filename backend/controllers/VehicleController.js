const Vehicle = require('../models/Vehicle');
const Route = require('../models/Route');

// Lấy danh sách phương tiện
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userID: req.userId });
    if (!vehicles || vehicles.length === 0) {
      return res.status(400).json({ message: 'Không có phương tiện nào.' });
    }
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm phương tiện
exports.createVehicle = async (req, res) => {
  try {
    const { type, plateNumber, capacity, maintenanceStatus } = req.body;

    const existingVehicle = await Vehicle.findOne({ plateNumber: plateNumber, userID: req.userId });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Biển số xe đã tồn tại.' });
    }
    
    const vehicle = new Vehicle({ type, plateNumber, capacity, maintenanceStatus, userID: req.userId });
    await vehicle.save();
    res.status(201).json({ message: 'Đã thêm phương tiện thành công', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật phương tiện
exports.updateVehicle = async (req, res) => {
  try {
    const {plateNumber, ...updates} = req.body;

    const vehicle = await Vehicle.findOne({ _id: req.params.id, userID: req.userId });
    if (!vehicle) {
      return res.status(400).json({ message: 'Phương tiện không tìm thấy hoặc truy cập bị từ chối.' });
    }

    if (plateNumber !== vehicle.plateNumber) {
      const existingVehicle = await Vehicle.findOne({ plateNumber: plateNumber, userID: req.userId, _id: { $ne: req.params.id }});
      if (existingVehicle) {
        return res.status(400).json({ message: 'Biển số xe đã tồn tại.' });
      }
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      {...updates, plateNumber: plateNumber},
      { new: true }
    );

    res.status(200).json({ message: 'Phương tiện đã cập nhật thành công.', updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa phương tiện
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, userID: req.userId });
    if (!vehicle) {
      return res.status(400).json({ message: 'Phương tiện không tìm thấy hoặc truy cập bị từ chối.' });
    }

    const route = await Route.findOne({ vehicleID: req.params.id, userID: req.userId });
    if (route) {
      return res.status(400).json({ message: 'Không thể phương tiện này vì đã có thông tin trong lộ trình vận chuyển.' });
    }

    await Vehicle.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Phương tiện đã xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};