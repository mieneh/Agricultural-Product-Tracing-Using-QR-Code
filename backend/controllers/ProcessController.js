const Process = require('../models/Process');

// Lấy danh sách quy trình sản xuất
exports.getProcesses = async (req, res) => {
  try {
    const processes = await Process.find({ userID: req.userId });
    if (!processes || processes.length === 0) {
      return res.status(400).json({ message: 'Không có quy trình sản xuất nào.' });
    }
    res.status(200).json(processes);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Thêm quy trình sản xuất
exports.createProcess = async (req, res) => {
  try {
    const { name, steps } = req.body;

    const existingProcess = await Process.findOne({ name: name.trim(), userID: req.userId });
    if (existingProcess) {
      return res.status(400).json({ message: 'Tên quy trình sản xuất đã tồn tại!' });
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ message: 'Steps phải là mảng đối tượng và không thể để trống' });
    }

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.name || !step.content) {
        return res.status(400).json({ message: `Bước ${i + 1} phải có tên và nội dung` });
      }
    }

    const process = new Process({ name: name.trim(), steps, userID: req.userId });
    await process.save();
    res.status(200).json({ message: 'Quy trình sản xuất đã được thêm thành công', process });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Cập nhật quy trình sản xuất
exports.updateProcess = async (req, res) => {
  try {
    const { name, steps } = req.body;

    const process = await Process.findOne({ _id: req.params.id, userID: req.userId });
    if (!process) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy quy trình sản xuất.' });
    }

    if (name && name.trim() !== process.name) {
      const existingProcess = await Process.findOne({ name: name.trim(), userID: req.userId, _id: { $ne: req.params.id }});
      if (existingProcess) {
        return res.status(400).json({ message: 'Tên quy trình sản xuất đã tồn tại.' });
      }
    }

    if (steps && (!Array.isArray(steps) || steps.length === 0)) {
      return res.status(400).json({ message: 'Steps phải là mảng đối tượng và không thể để trống' });
    }

    if (steps) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (!step.name || !step.content) {
          return res.status(400).json({ message: `Bước ${i + 1} phải có tên và nội dung` });
        }
      }
    }

    process.name = name.trim() || process.name;
    if (steps) { process.steps = steps; }
    await process.save();
    res.status(200).json({ message: 'Quy trình đã được cập nhật thành công', process });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};

// Xóa quy trình sản xuất
exports.deleteProcess = async (req, res) => {
  try {
    const process = await Process.findOne({ _id: req.params.id, userID: req.userId });
    if (!process) {
      return res.status(400).json({ message: 'Truy cập bị từ chối hoặc không tìm thấy quy trình sản xuất.' });
    }

    await Process.findByIdAndDelete({ _id: req.params.id, userID: req.userId });
    res.status(200).json({ message: 'Quy trình sản xuất đã được xóa thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau.', error: error.message });
  }
};