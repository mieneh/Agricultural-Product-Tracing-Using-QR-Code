const Connection = require('../models/Connection');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Lấy danh sách đối tác với vai trò là Nhà Sản Xuất
exports.getConnectionsWithProducer = async (req, res) => {
    try {
        const connections = await Connection.find({ producerID: req.userId })
            .populate({ path: 'transporterID', model: User });
        res.status(200).json(connections);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Lấy danh sách đối tác với vai trò là Nhà Vận Chuyển
exports.getConnectionsWithTransporter = async (req, res) => {
    try {
        const connections = await Connection.find({ transporterID: req.userId })
            .populate({ path: 'producerID', model: User });
        res.status(200).json(connections);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Tạo yêu cầu từ nhà vận chuyển tới nhà sản xuất
exports.createConnectionWithProducer = async (req, res) => {
    try {
        const { transporterID, message } = req.body;
        const producer = await User.findById(req.userId);
        if (!producer) {
            return res.status(400).json({ message: "Nhà sản xuất không tồn tại" });
        }

        const connection = new Connection({ producerID: req.userId, transporterID, message, typeProducer: "Sent", typeTransporter: "Received" });
        await connection.save();

        const content = `${producer.farmName} đã gửi yêu cầu hợp tác với bạn.`;
        const notification = new Notification({ userID: transporterID, content, type: 'connection' });
        await notification.save();

        res.status(200).json({ message: 'Yêu cầu gửi thành công', connection });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Tạo yêu cầu từ nhà vận chuyển tới nhà sản xuất
exports.createConnectionWithTransporter = async (req, res) => {
    try {
        const { producerID, message } = req.body;
        const transporter = await User.findById(req.userId);
        if (!transporter) {
            return res.status(400).json({ message: "Nhà vận chuyển không tồn tại" });
        }

        const connection = new Connection({ producerID, transporterID: req.userId, message, typeProducer: "Received", typeTransporter: "Sent" });
        await connection.save();

        const content = `${transporter.companyName} đã gửi yêu cầu hợp tác với bạn.`;
        const notification = new Notification({ userID: producerID, content, type: 'connection' });
        await notification.save();
        
        res.status(200).json({ message: 'Yêu cầu gửi thành công', connection });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Chấp nhận hoặc từ chối yêu cầu hợp tác
exports.updateConnectionStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const updateConnection = await Connection.findOneAndUpdate(
            { _id: req.params.id, $or: [{ producerID: req.userId }, { transporterID: req.userId }] },
            { status: status },
            { new: true }
        ).populate("producerID", "farmName name")
        .populate("transporterID", "companyName name");

        if (!updateConnection) {
            return res.status(400).json({ message: 'Yêu cầu hợp tác không tìm thấy.' });
        }

        if (status === "Accepted") {
            if (String(updateConnection.producerID._id) === String(req.userId)) {
                const content = `${updateConnection.producerID.farmName} đã chấp nhận yêu cầu hợp tác của bạn.`;
                const notification = new Notification({ userID: updateConnection.transporterID, content, type: "connection" });
                await notification.save();
            } 
            else if (String(updateConnection.transporterID._id) === String(req.userId)) {
                const content = `${updateConnection.transporterID.companyName} đã chấp nhận yêu cầu hợp tác của bạn.`;
                const notification = new Notification({ userID: updateConnection.producerID, content, type: "connection" });
                await notification.save();
            }
        }

        res.status(200).json({ message: 'Trạng thái yêu cầu hợp tác đã được cập nhật.', updateConnection });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};

// Hủy yêu cầu hợp tác
exports.cancelConnectionRequest = async (req, res) => {
    try {
        const connection = await Connection.findOne({ _id: req.params.id, $or: [{ producerID: req.userId }, { transporterID: req.userId }] });
        if (!connection) {
            return res.status(400).json({ message: 'Yêu cầu không tồn tại hoặc bạn không có quyền hủy yêu cầu này.' });
        }

        await Connection.findOneAndDelete({ _id: req.params.id, $or: [{ producerID: req.userId }, { transporterID: req.userId }] });
        return res.status(200).json({ message: 'Yêu cầu hợp tác đã bị hủy thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
};