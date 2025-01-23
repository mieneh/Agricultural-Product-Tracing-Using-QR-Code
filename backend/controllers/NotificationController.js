const Notification = require('../models/Notification');

// Lấy danh sách thông báo
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userID: req.userId }).sort({ createdAt: -1 });
    if (!notifications || notifications.length === 0) {
      return res.status(400).json({ message: 'Không có thông báo nào.' });
    }
    res.status(200).json(notifications || []);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const notifications = await Notification.findByIdAndDelete(req.params.id);
    if (!notifications) {
      return res.status(400).json({ message: 'Không tìm thấy thông báo.' });
    }
    res.status(200).json({ message: 'Thông báo đã được xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa tất cả thông báo của người dùng đó
exports.deleteAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.deleteMany({ userID: req.userId });
    if (!notifications) {
      return res.status(400).json({ message: 'Không có thông báo nào để xóa.' });
    }
    res.status(200).json({ message: `Đã xóa ${notifications.deletedCount} thông báo thành công.` });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};


// Đánh dấu thông báo là đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate( req.params.id, { read: true }, { new: true } );
    if (!notification) {
      return res.status(400).json({ message: 'Không tìm thấy thông báo nào.' });
    }
    res.status(200).json({ message: 'Thông báo đã được đánh dấu là đã đọc.', notification });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Đánh dấu tất cả thông báo là đã đọc
exports.markAllAsRead = async (req, res) => {
    try {
      const notification = await Notification.updateMany( { userID: req.userId, read: false }, { $set: { read: true } } );
      if (!notification) {
        return res.status(400).json({ message: 'Không tìm thấy thông báo nào.' });
      }
      res.status(200).json({ message: 'Tất cả thông báo được đánh dấu là đã đọc thành công.', modifiedCount: notification.modifiedCount });
    } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};