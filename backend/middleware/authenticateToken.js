const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: 'Không có token xác thực' });
    }
    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = authenticateToken;