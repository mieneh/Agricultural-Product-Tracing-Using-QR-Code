const Product = require('../models/Product');
const { cloudinary, createUploader } = require('../utils/cloudinary');
const upload = createUploader('products');

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userID: req.userId })
      .populate('category')
      .exec();
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm nào.' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'Lỗi upload ảnh.' });

    try {
      const { category, name, description } = req.body;

      const existingProduct = await Product.findOne({ name: name.trim(), userID: req.userId });
      if (existingProduct) {
        return res.status(400).json({ message: 'Tên sản phẩm đã tồn tại!' });
      }

      const image = req.file?.path || null;
      const product = new Product({ category, name: name.trim(), description, image, userID: req.userId });
      await product.save();
      res.status(200).json({ message: 'Thêm sản phẩm thành công!', product });
    } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
  });
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'Lỗi upload ảnh.' });

    try {
      const { name, ...updates } = req.body;
      const product = await Product.findOne({ _id: req.params.id, userID: req.userId });

      if (!product) {
        return res.status(400).json({ message: 'Không tìm thấy sản phẩm.' });
      }

      if (name && name.trim() !== product.name) {
        const existingProduct = await Product.findOne({ name: name.trim(), userID: req.userId, _id: { $ne: req.params.id }});
        if (existingProduct) {
          return res.status(400).json({ message: 'Tên sản phẩm này đã tồn tại.' });
        }
      }

      if (req.file && product.image) {
        try {
          const publicId = product.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (err) {
          console.error('Lỗi khi xóa ảnh cũ trên Cloudinary:', err);
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { ...updates, name: name ? name.trim() : product.name, image: req.file?.path || product.image, },
        { new: true }
      );
      res.status(200).json({ message: 'Cập nhật sản phẩm thành công!', updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
    }
  });
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userID: req.userId });
    if (!product) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy sản phẩm.' });
    }
    
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }
    
    await Product.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Xóa sản phẩm thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};