const Category = require('../models/Category');
const Product = require('../models/Product');

// Lấy danh sách loại sản phẩm
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userID: req.userId });
    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: 'Không có loại sản phẩm nào.' });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm loại sản phẩm
exports.createCategory = async (req, res) => {
  try {
    const { name, description, expiry, maxday } = req.body;

    const existingCategory = await Category.findOne({ name: name.trim(), userID: req.userId });
    if (existingCategory) {
      return res.status(400).json({ message: 'Loại sản phẩm này đã tồn tại.' });
    }

    const category = new Category({ name: name.trim(), description, expiry, maxday, userID: req.userId });
    await category.save();
    res.status(200).json({ message: 'Đã thêm mới danh mục thành công.', category });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật loại sản phẩm
exports.updateCategory = async (req, res) => {
  try {
    const { name, ...updates } = req.body;

    const category = await Category.findOne({ _id: req.params.id, userID: req.userId });
    if (!category) {
      return res.status(400).json({ message: 'Không tìm thấy hoặc không có quyền truy cập danh mục này.' });
    }

    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({ name: name.trim(), userID: req.userId, _id: { $ne: req.params.id }});
      if (existingCategory) {
        return res.status(400).json({ message: 'Loại sản phẩm này đã tồn tại.' });
      }
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id, userID: req.userId },
      { ...updates, name: name ? name.trim() : category.name },
      { new: true }
    );
    res.status(200).json({ message: 'Đã cập nhật danh mục thành công.', updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa loại sản phẩm
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, userID: req.userId });
    if (!category) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy danh mục.' });
    }

    const product = await Product.findOne({ category: req.params.id, userID: req.userId });
    if (product) {
      return res.status(400).json({ message: 'Không thể danh mục này vì đã có thông tin trong sản phẩm.' });
    }

    await Category.findOneAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Đã xóa danh mục thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};