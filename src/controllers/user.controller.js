const db = require("../models/index");
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

exports.changePassword = async (req, res) => {
    const userId = req.userId;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    try {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).send({ error: 'Not all required data: oldPassword, newPassword, confirmNewPassword was received' });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).send({ error: 'confirmNewPassword do not match' });
        }
        const user = await db.user.findOne({ where: userId });
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).send({ error: 'Incorrect old password' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedNewPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.changePhoneNumber = async (req, res) => {
    const userId = req.userId;
    const { password, newPhoneNumber } = req.body;
    try {
        if (!password || !newPhoneNumber) {
            return res.status(400).send({ error: 'Not all required data: password, newPhoneNumber' });
        }
        const user = await db.user.findOne({ where: userId });
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Incorrect password' });
        }
        await user.update({ phone: newPhoneNumber });
        res.status(200).json({ message: 'Phone number updated successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.updateUserInfo = async (req, res) => {
    const userId = req.userId;
    const { password, firstname, lastname, avatar } = req.body;
    if (!password) {
        return res.status(400).send({ error: 'Please ensure that the password is provided.' });
    }
    try {
        const user = await db.user.findOne({ where: userId });
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Incorrect password' });
        }
        await user.update({
            firstname: firstname || user.firstname,
            lastname: lastname || user.lastname,
            avatar: avatar || user.avatar
        });
        res.status(200).json({ message: 'User information updated successfully'});
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { nickname, password } = req.body;
    const userId = req.userId;
    if (!password || !nickname) {
        return res.status(400).send({ error: 'Not all required data: password, nickname was received' });
    }
    try {
        const user = await db.user.findByPk(userId);
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }
        if (user.nickname !== nickname) {
            return res.status(400).send({ error: 'Nickname does not match the authenticated user' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Incorrect password' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.findUser = async (req, res) => {
    const { query } = req.body;
    try {
        if (!query) {
            return res.status(400).send({ error: 'No search query provided' });
        }
        const user = await db.user.findOne({
            where: {
                [Op.or]: [
                    { nickname: query },
                    { phone: query }
                ]
            },
            include: {
                model: db.role,
                attributes: ['role'],
                through: { attributes: [] }
            },
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt',
                    'password'
                ]
            }
        });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.allUsers = async (req, res) => {
    try {
        const users = await db.user.findAll({
            include: {
                model: db.role,
                attributes: ['role'],
                through: { attributes: [] }
            },
            attributes: {
                exclude: [
                    'createdAt',
                    'updatedAt',
                    'password'
                ]
            }
        });
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
