const Retailer = require('../models/Retailer');

// Lấy danh sách nhà bán lẻ
exports.getRetailers = async (req, res) => {
  try {
    const retailers = await Retailer.find({ userID: req.userId });
    if (!retailers || retailers.length === 0) {
      return res.status(400).json({ message: 'Không có nhà bán lẻ nào.' });
    }
    res.status(200).json(retailers);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm nhà bán lẻ
exports.createRetailer = async (req, res) => {
  try {
    const { type, fullname, address, phone, email } = req.body;

    const existingRetailer = await Retailer.findOne({ phone: phone, userID: req.userId });
    if (existingRetailer) {
      return res.status(400).json({ message: 'Số điện thoại của nhà bán lẻ này đã tồn tại.' });
    }

    const retailer = new Retailer({ type, fullname, address, phone, email, userID: req.userId });
    await retailer.save();
    res.status(200).json({ message: 'Nhà bán lẻ đã được thêm thành công.', retailer });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật nhà bán lẻ
exports.updateRetailer = async (req, res) => {
  try {
    const {phone, ...updates} = req.body;

    const retailer = await Retailer.findOne({ _id: req.params.id, userID: req.userId });
    if (!retailer) {
      return res.status(400).json({ message: 'Không tìm thấy nhà bán lẻ hoặc quyền truy cập bị từ chối.' });
    }

    if (phone !== retailer.phone) {
      const existingRetailer = await Retailer.findOne({ phone: phone, userID: req.userId, _id: { $ne: req.params.id }});
      if (existingRetailer) {
        return res.status(400).json({ message: 'Số điện thoại của nhà bán lẻ này đã tồn tại.' });
      }
    }

    const updatedRetailer = await Retailer.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      {...updates, phone: phone},
      { new: true }
    );
    res.status(200).json({ message: 'Nhà bán lẻ đã cập nhật thành công.', updatedRetailer });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa nhà bán lẻ
exports.deleteRetailer = async (req, res) => {
  try {
    const retailer = await Retailer.findOne({ _id: req.params.id, userID: req.userId });
    if (!retailer) {
      return res.status(400).json({ message: 'Không tìm thấy nhà bán lẻ hoặc quyền truy cập bị từ chối.' });
    }

    await Retailer.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Nhà bán lẻ đã xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};