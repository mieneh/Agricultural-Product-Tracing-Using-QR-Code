const Outbound = require('../models/Outbound');
const Inbound = require('../models/Inbound');
const Retailer = require('../models/Retailer');
const Harvest = require('../models/Harvest');
const Product = require('../models/Product');

// Lấy danh sách xuất kho
exports.getOutbounds = async (req, res) => {
  try {
    const outbounds = await Outbound.find({ userID: req.userId })
      .populate({path: 'entryID', model: Inbound, populate: { path: 'batchID', model: Harvest, populate: [{ path: 'product', model: Product }],},})
      .populate({path: 'retailerID', model: Retailer});
    if (!outbounds || outbounds.length === 0) {
      return res.status(400).json({ message: 'Không có danh sách xuất kho nào.' });
    }
    res.status(200).json(outbounds);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm xuất kho
exports.createOutbound = async (req, res) => {
  try {
    const { exitDate, entryID, quantity, note, retailerID } = req.body;

    const inbound = await Inbound.findOne({ _id: entryID, userID: req.userId }).populate('batchID');
    if (!inbound) {
      return res.status(400).json({ message: 'Không tìm thấy phiếu nhập kho hoặc quyền truy cập bị từ chối.' });
    }

    if (quantity > inbound.remainingQuantity) {
      return res.status(400).json({message: `Số lượng xuất (${quantity}) vượt quá tồn kho hiện tại (${inbound.remainingQuantity}).`,});
    }

    const outbound = new Outbound({ exitDate, entryID, quantity, note, retailerID, userID: req.userId });
    await outbound.save();

    inbound.remainingQuantity -= quantity;
    if (inbound.remainingQuantity === 0) {
      inbound.status = 'Completed';
    } else if (inbound.status === 'Pending') {
      inbound.status = 'In Progress';
    }
    await inbound.save();
    res.status(200).json({ message: 'Sản phẩm xuất kho đã được thêm thành công.', outbound });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật xuất kho
exports.updateOutbound = async (req, res) => {
  try {
    const { quantity, note, retailerID} = req.body;

    const outbound = await Outbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!outbound) {
      return res.status(400).json({ message: 'Không tìm thấy sản phẩm xuất kho hoặc quyền truy cập bị từ chối.' });
    }

    const inbound = await Inbound.findOne({ _id: outbound.entryID, userID: req.userId });
    if (!inbound) {
      return res.status(400).json({ message: 'Không tìm thấy phiếu nhập kho tương ứng.' });
    }

    inbound.remainingQuantity += outbound.quantity;
    if (quantity > inbound.remainingQuantity) {
      return res.status(400).json({message: `Số lượng xuất mới (${quantity}) vượt quá tồn kho khả dụng (${inbound.remainingQuantity}).`});
    }
    inbound.remainingQuantity -= quantity;
    inbound.status = inbound.remainingQuantity === 0 ? 'Completed' : 'In Progress';
    await inbound.save();

    outbound.quantity = quantity;
    outbound.note = note;
    outbound.retailerID = retailerID;
    await outbound.save();

    res.status(200).json({ message: 'Sản phẩm xuất kho đã cập nhật thành công.', updatedOutbound });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa xuất kho
exports.deleteOutbound = async (req, res) => {
  try {
    const outbound = await Outbound.findOne({ _id: req.params.id, userID: req.userId });
    if (!outbound) {
      return res.status(400).json({ message: 'Không tìm thấy sản phẩm xuất kho hoặc quyền truy cập bị từ chối.' });
    }

    await Outbound.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Sản phẩm xuất kho đã xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};