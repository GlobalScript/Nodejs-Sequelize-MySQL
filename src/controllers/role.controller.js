const db = require("../models/index");

exports.addRole = async (req, res) => {
    const {userId, roleId} = req.body;
    try {
        const user = await db.user.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const role = await db.role.findByPk(roleId);
        if (!role) {
            throw new Error("Role not found");
        }
        const hasRole = await user.hasRole(role);
        if (hasRole) {
            throw new Error("Role already exists for this user");
        }
        await user.addRole(role);
        res.status(200).json({ message: "Role added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteRole = async (req, res) => {
    const {userId, roleId} = req.body;
    try {
        const user = await db.user.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const role = await db.role.findByPk(roleId);
        if (!role) {
            throw new Error("Role not found");
        }
        const hasRole = await user.hasRole(role);
        if (!hasRole) {
            throw new Error("Role does not exist for this user");
        }
        await user.removeRole(role);
        res.status(200).json({ message: "Role removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


