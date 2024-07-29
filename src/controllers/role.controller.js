const db = require("../models/index");
const {Roles} = require('../config/constants');

const addRoleToUser = async (userId, roleId) => {
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
};

const removeRoleFromUser = async (userId, roleId) => {
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
};

exports.addAdminRole = async (req, res) => {
    const userId = req.userId;
    const { adminSecretKey, roleId } = req.body;

    if (!adminSecretKey || !roleId) {
        return res.status(400).json({ message: 'Not all required data: adminSecretKey, roleId' });
    }
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(400).json({ message: 'adminSecretKey is incorrect' });
    }
    try {
        await addRoleToUser(userId, roleId);
        res.status(200).json({ message: "Role added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addRole = async (req, res) => {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) {
        return res.status(400).json({ message: 'Not all required data: userId, roleId' });
    }
    try {
        await addRoleToUser(userId, roleId);
        res.status(200).json({ message: "Role added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAdminRole = async (req, res) => {
    const userId = req.userId;
    const { adminSecretKey, roleId } = req.body;
    if (!adminSecretKey || !roleId) {
        return res.status(400).json({ message: 'Not all required data: adminSecretKey, roleId' });
    }
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(400).json({ message: 'adminSecretKey is incorrect' });
    }
    try {
        await removeRoleFromUser(userId, roleId);
        res.status(200).json({ message: "Role removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteRole = async (req, res) => {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) {
        return res.status(400).json({ message: 'Not all required data: userId, roleId' });
    }
    try {
        const role = await db.role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        if (role.id === Roles.ADMIN) {
            return res.status(403).json({ message: 'Cannot remove admin role' });
        }
        await removeRoleFromUser(userId, roleId);
        res.status(200).json({ message: "Role removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


