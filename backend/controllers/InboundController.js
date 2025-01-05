const Inbound = require('../models/Inbound');
const Harvest = require('../models/Harvest');

// Lấy danh sách nhập kho
exports.getInbounds = async (req, res) => {
  try {
    const inbounds = await Inbound.find({ userID: req.userId })
    .populate('batchID');
    if (!inbounds || inbounds.length === 0) {
      return res.status(400).json({ message: 'Không có danh sách nhập kho nào.' });
    }
    res.status(200).json(inbounds);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm nhập kho
exports.createInbound = async (req, res) => {
  try {
    const { batchID, entryDate, storageCondition } = req.body;

    const harvest = await Harvest.findOne({ _id: batchID, distributorID: req.userId });
    if (!harvest) {
      return res.status(400).json({ message: 'Không tìm thấy lô thu hoạch.' });
    }

    const existingInbound = await Inbound.findOne({ batchID: batchID, userID: req.userId });
    if (existingInbound) {
      return res.status(400).json({ message: 'Lô thu hoạch này đã tồn tại trong kho.' });
    }

    const inbound = new Inbound({ batchID, entryDate, storageCondition, quantity: harvest.quantity, remainingQuantity: harvest.quantity, userID: req.userId });
    await inbound.save();
    res.status(200).json({ message: 'Tạo phiếu nhập kho thành công.', inbound });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật nhập kho
exports.updateInbound = async (req, res) => {
  try {
    const { batchID, ...updates} = req.body;

    const inbound = await Inbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!inbound) {
      return res.status(400).json({ message: 'Không tìm thấy sản phẩm nhập kho hoặc quyền truy cập bị từ chối.' });
    }

    if (batchID !== inbound.batchID) {
      const existingInbound = await Inbound.findOne({ batchID: batchID, userID: req.userId, _id: { $ne: req.params.id }});
      if (existingInbound) {
        return res.status(400).json({ message: 'Sản phẩm này đã tồn tại trong kho.' });
      }
    }

    const updatedInbound = await Inbound.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      {...updates, batchID: batchID},
      { new: true }
    );
    res.status(200).json({ message: 'Sản phẩm nhập kho đã cập nhật thành công.', updatedInbound });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa nhập kho
exports.deleteInbound = async (req, res) => {
  try {
    const inbound = await Inbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!inbound) {
      return res.status(400).json({ message: 'Không tìm thấy sản phẩm nhập kho hoặc quyền truy cập bị từ chối.' });
    }

    await Inbound.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Sản phẩm nhập kho đã xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};