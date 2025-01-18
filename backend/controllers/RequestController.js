const Request = require('../models/Request');
const Harvest = require('../models/Harvest');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Lấy tất cả yêu cầu
exports.getAllRequests = async (req, res) => {
  try {
      const userId = req.userId;
      const requests = await Request.find({$or: [
        { distributorID: userId },
        { harvestID: { $in: await Harvest.find({ userID: userId }).select('_id') } }
      ]})
      .populate('distributorID')
      .populate({
          path: 'harvestID',
          model: Harvest,
          populate: [
            { path: 'product', model: Product },
            { path: 'userID', model: User },
            { path: 'distributorID', model: User },
            { path: 'transporterID', model: User }
          ]
      })
      .exec();
      res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Lấy chi tiết yêu cầu
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('distributorID', 'name')
      .populate('harvestID', 'name')
      .exec();

    if (!request) {
      return res.status(404).json({ message: 'Yêu cầu không tìm thấy.' });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Gửi yêu cầu
exports.sendRequest = async (req, res) => {
  const { harvestID } = req.body;
  const distributorID = req.userId;

  try {
    const distributor = await User.findById(distributorID);
    if (distributor.role !== 'Distributor') {
      return res.status(400).json({ message: 'Người dùng không phải là Nhà phân phối' });
    }

    const harvest = await Harvest.findById(harvestID);
    if (!harvest.userID){
      return res.status(400).json({ message: 'Không tìm thấy Nhà sản xuất cho lô hàng này.' });
    }

    const request = new Request({distributorID: distributorID, harvestID: harvestID,});
    await request.save();

    const content = `${distributor.companyName} đã gửi yêu cầu hợp tác với lô hàng ${harvest.batch} của bạn.`;
    const notification = new Notification({ userID: harvest.userID, content, type: 'request' });
    await notification.save();

    return res.status(200).json({ message: 'Yêu cầu đã được gửi thành công đến Nhà sản xuất.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật trạng thái yêu cầu
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    }

    const request = await Request.findByIdAndUpdate(req.params.id, { status, message }, { new: true });
    if (!request) {
      return res.status(400).json({ message: 'Yêu cầu không tìm thấy.' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái thành công.', request});
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Chấp nhận yêu cầu
exports.acceptRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    if (!request || request.status !== 'Pending') {
        return res.status(400).json({ message: 'Yêu cầu không tồn tại hoặc đã được xử lý.' });
    }

    const harvest = await Harvest.findById(request.harvestID);
    if (!harvest || !harvest.userID) {
      return res.status(400).json({ message: 'Không tìm thấy lô hàng liên quan.' });
    }

    const producer = await User.findById(harvest.userID);
    if (!producer || producer.role !== 'Producer') {
      return res.status(400).json({ message: 'Người dùng không phải là Nhà sản xuất.' });
    }

    // Cập nhật trạng thái yêu cầu và hủy các yêu cầu còn lại liên quan đến cùng harvestID
    request.status = 'Accepted';
    await request.save();
    await Request.updateMany(
      { harvestID: request.harvestID, _id: { $ne: id }, status: 'Pending' },
      { $set: { status: 'Cancelled', message: 'Nhà sản xuất đã đồng ý lô hàng này với nhà phân phối khác.' } }
    );

    harvest.distributorID = request.distributorID;
    await harvest.save();

    const content = `${producer.farmName} đã đồng ý hợp tác với lô hàng ${harvest.batch} của họ.`;
    const notification = new Notification({ userID: harvest.distributorID, content, type: 'request' });
    await notification.save();

    return res.status(200).json({ message: 'Yêu cầu đã được chấp nhận.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Gán chỉ định Nhà vận chuyển
exports.assignTransporter = async (req, res) => {
  const { requestID, transporterID } = req.body;
  
  try {
    const request = await Request.findById(requestID);
    if (!request || request.status !== 'Accepted') {
      return res.status(400).json({ message: 'Yêu cầu không tồn tại hoặc không khả dụng.' });
    }

    const harvest = await Harvest.findById(request.harvestID);
    if (!harvest || !harvest.userID) {
      return res.status(400).json({ message: 'Không tìm thấy lô hàng liên quan.' });
    }

    const producer = await User.findById(harvest.userID);
    if (!producer || producer.role !== 'Producer') {
        return res.status(400).json({ message: 'Người dùng không phải là Nhà sản xuất.' });
    }

    const transporter = await User.findById(transporterID);
    if (!transporter || transporter.role !== 'Transport') {
      return res.status(400).json({ message: 'Người dùng không phải là Nhà vận chuyển.' });
    }

    harvest.transporterID = transporterID;
    await harvest.save();

    const content = `Bạn nhận được yêu cầu giao lô hàng ${harvest.batch} của nhà sản xuất ${producer.farmName}.`;
    const notification = new Notification({ userID: transporterID, content, type: 'request' });
    await notification.save();

    return res.status(200).json({ message: 'Nhà vận chuyển đã được gán thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};