const Region = require('../models/Region');

// Lấy danh sách vùng sản xuất
exports.getRegions = async (req, res) => {
  try {
    const regions = await Region.find({ userID: req.userId });
    if (!regions || regions.length === 0) {
      return res.status(400).json({ message: 'Không có vùng sản xuất nào.' });
    }
    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm vùng sản xuất
exports.createRegion = async (req, res) => {
  try {
    const { type, name, address, area, description } = req.body;

    const existingRegion = await Region.findOne({ name: name.trim(), userID: req.userId });
    if (existingRegion) {
      return res.status(400).json({ message: 'Vùng sản xuất này đã tồn tại.' });
    }

    const region = new Region({type, name: name.trim(), address, area, description, userID: req.userId});
    await region.save();
    res.status(200).json({ message: 'Đã thêm vùng sản xuất thành công.', region });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật vùng sản xuất
exports.updateRegion = async (req, res) => {
  try {
    const { name, ...updates } = req.body;

    const region = await Region.findOne({ _id: req.params.id, userID: req.userId });
    if (!region) {
      return res.status(400).json({message: 'Truy cập bị từ chối hoặc không tìm thấy vùng sản xuất.'});
    }

    if (name && name.trim() !== region.name) {
      const existingRegion = await Region.findOne({ name: name.trim(), userID: req.userId, _id: { $ne: req.params.id }});
      if (existingRegion) {
        return res.status(400).json({ message: 'Vùng sản xuất này đã tồn tại.' });
      }
    }

    const updatedRegion = await Region.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      { ...updates, name: name ? name.trim() : region.name },
      { new: true }
    );
    res.status(200).json({ message: 'Vùng sản xuất đã cập nhật thành công.', updatedRegion });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa vùng sản xuất
exports.deleteRegion = async (req, res) => {
  try {
    const region = await Region.findOne({ _id: req.params.id, userID: req.userId });
    if (!region) {
      return res.status(400).json({message: 'Truy cập bị từ chối hoặc không tìm thấy vùng sản xuất.'});
    }

    await Region.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Vùng sản xuất đã xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};