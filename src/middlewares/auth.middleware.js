const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ error: 'Token is required' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send({ error: 'Invalid token' });
    }
};
