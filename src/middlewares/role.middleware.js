const db = require('../models/index');
const {Roles} = require('../config/constants');


exports.accessRole = (roleIds = [Roles.ADMIN, Roles.MODERATOR]) => {
    return async (req, res, next) => {
        const userId = req.userId;
        try {
            const user = await db.user.findByPk(userId, {
                include: [{
                    model: db.role,
                    where: {
                        id: roleIds
                    }
                }]
            });
            if (!user) {
                return res.status(401).json({ error: 'Access Role: The user doesn\'t have the right role to access this path' });
            }
            next();
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
};
