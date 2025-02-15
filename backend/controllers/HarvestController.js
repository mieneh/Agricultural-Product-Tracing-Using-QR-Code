require("dotenv").config();
const BASE_URL = process.env.BASE_URL

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Process = require('../models/Process');
const Region = require('../models/Region');
const Harvest = require('../models/Harvest');
const Route = require('../models/Route');
const Request = require('../models/Request');
const Sensor = require('../models/Sensor');

const { uploadBufferToCloudinary, cloudinary } = require('../utils/Cloudinary');
const qr = require('qr-image');

// Lấy danh sách lô hàng
exports.getHarvests = async (req, res) => {
  try {
    const harvests = await Harvest.find({$or: [{ distributorID: req.userId },{ transporterID: req.userId },{ userID: req.userId },],})
      .populate('product')
      .populate('location')
      .populate('process')
      .populate('userID')
      .populate('distributorID')
      .populate('transporterID')
      .exec();

    const filteredHarvests = await Promise.all(
      harvests.map(async (harvest) => {
        if (harvest.distributorID && harvest.distributorID.equals(req.userId)) {
          const routeMatch = await Route.findOne({batchID: harvest._id, status: 'Completed',});
          return routeMatch ? harvest : null;
        }
        if (harvest.transporterID && harvest.transporterID.equals(req.userId)) {
          const routeMatch = await Route.findOne({ batchID: harvest._id });
          return !routeMatch ? harvest : null;
        }
        return harvest;
      })
    );
    const result = filteredHarvests.filter((item) => item !== null);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm lô hàng
exports.createHarvest = async (req, res) => {
  try {
    const { batch, harvestDate, expirationDate, product, location, process, quantity, note } = req.body;

    const [productExists, regionExists, processExists] = await Promise.all([
      Product.findOne({ _id: product, userID: req.userId }),
      Region.findOne({ _id: location, userID: req.userId }),
      Process.findOne({ _id: process, userID: req.userId }),
    ]);

    if (!productExists || !regionExists || !processExists) {
      return res.status(400).json({ message: 'Sản phẩm, khu vực hoặc quy trình không được tìm thấy.' });
    }

    const existingHarvest = await Harvest.findOne({ batch, userID: req.userId });
    if (existingHarvest) {
      return res.status(400).json({ message: 'Tên lô hàng đã tồn tại.' });
    }

    const harvest = new Harvest({ batch, harvestDate, expirationDate, product, location, process, quantity, note, userID: req.userId });
    await harvest.save();

    const qrCodeBuffer = qr.imageSync( `${BASE_URL}/harvest/${harvest._id}`, { type: 'png' } );
    harvest.qrCode = await uploadBufferToCloudinary(qrCodeBuffer, 'qr', `${harvest._id}`);
    await harvest.save();
    return res.status(200).json({ message: 'Đã thêm lô hàng thành công!', harvest });
  } catch (error) {
    return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật lô hàng
exports.updateHarvest = async (req, res) => {
  try {
    const { batch, ...updates } = req.body;

    const harvest = await Harvest.findOne({ _id: req.params.id, userID: req.userId });
    if (!harvest) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy lô hàng.' });
    }

    if (batch !== harvest.batch) {
      const existingHarvest = await Harvest.findOne({ batch: batch, userID: req.userId, _id: { $ne: req.params.id }});
      if (existingHarvest) {
        return res.status(400).json({ message: 'Tên lô hàng đã tồn tại.' });
      }
    }

    const updatedHarvest = await Harvest.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      updates,
      { new: true }
    );

    res.status(200).json({ message: 'Lô hàng được cập nhật thành công.', updatedHarvest });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa lô hàng
exports.deleteHarvest = async (req, res) => {
  try {
    const harvest = await Harvest.findOne({ _id: req.params.id, userID: req.userId });
    if (!harvest) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy lô hàng.' });
    }

    const request = await Request.exists({ harvestID: req.params.id });
    if (request) {
      return res.status(400).json({ message: 'Không thể xóa lô hàng này vì đã có yêu cầu hợp tác.' });
    }

    if (harvest.qrCode) {
      const publicId = harvest.qrCode.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`qr/${publicId}`);
    }

    await Harvest.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Lô hàng đã được xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Lấy đơn hàng cho đợt thu hoạch
exports.getHarvestOrder = async (req, res) => {
  try {
    const acceptedRequests = await Request.find({ status: 'Accepted' }).select('harvestID');
    const acceptedHarvestIDs = acceptedRequests.map(request => request.harvestID.toString());
    
    const harvests = await Harvest.find({ _id: { $in: acceptedHarvestIDs }, $or: [{ distributorID: req.userId }, { transporterID: req.userId }, {userID: req.userId} ]})
      .populate({ path: 'product', model: Product, populate: { path: 'category', model: Category } })
      .populate('location')
      .populate('process')
      .populate('userID')
      .populate('distributorID')
      .populate('transporterID')
      .exec();
    
    const harvestBatches = harvests.map((harvest) => harvest.batch);
    const sensors = await Sensor.find({
        batchID: { $in: harvestBatches },
    }).exec();

    const harvestIDs = harvests.map((harvest) => harvest._id);
    const routes = await Route.find({
        batchID: { $in: harvestIDs },
    }).select('batchID status').exec();

    const result = harvests.map((harvest) => {
      const relatedSensors = sensors.filter((sensor) => sensor.batchID === harvest.batch);
      const relatedRoute = routes.find((route) => route.batchID.toString() === harvest._id.toString());

      return {
        ...harvest.toObject(),
        sensors: relatedSensors,
        routeStatus: relatedRoute ? relatedRoute.status : null,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Lấy danh sách lô hàng nhưng loại bỏ những lô hàng đã được chấp nhận
exports.getAllHarvest = async (req, res) => {
  try {
    const acceptedRequests = await Request.find({ status: 'Accepted' }).select('harvestID');
    const excludedHarvestIDs = acceptedRequests.map(request => request.harvestID.toString());
        
    const harvests = await Harvest.find({ _id: { $nin: excludedHarvestIDs } })
      .populate({ path: 'product', model: Product, populate: { path: 'category', model: Category } })
      .populate({ path: 'location', model: Region })
      .populate({ path: 'process', model: Process })
      .populate({ path: 'userID', model: User });

    res.status(200).json({ count: harvests.length, data: harvests });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  };
};

// Lấy thông tin lô hàng theo ID
exports.getHarvestsById = async (req, res) => {
  try {
    const harvest = await Harvest.findById(req.params.id)
      .populate({ path: 'product', model: Product, populate: { path: 'category', model: Category } })
      .populate('location')
      .populate('process')
      .populate('userID')
      .populate('distributorID')
      .populate('transporterID')
      .exec();

    if (!harvest) {
      return res.status(400).json({ message: 'Không tìm thấy lô hàng.' });
    }

    res.status(200).json(harvest);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};