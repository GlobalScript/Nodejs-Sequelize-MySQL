const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');

exports.signUp = async (req, res) => {
    const { password, nickname, confirmPassword, phone, firstname, lastname, avatar } = req.body;
    if (!password || !nickname || !confirmPassword || !phone || !firstname || !lastname) {
        return res.status(400).json({ error: 'Not all parameters are provided' });
    }
    if (password.length < 6) {
        return res.status(400).send({ error: 'Password must be at least 6 characters long' });
    }
    if (password !== confirmPassword) {
        return res.status(400).send({ error: 'Passwords do not match' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
            nickname,
            phone,
            password: hashedPassword,
            firstname,
            lastname,
            avatar
        });
        const role = await db.role.findByPk(1);
        if (!role) {
            throw new Error("User role not found");
        }
        await user.addRole(role);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send(err.errors);
    }
};


exports.signIn = async (req, res) => {
    const { nickname, password } = req.body;
    try {
        const user = await db.user.findOne({ where: { nickname } });
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Incorrect password' });
        }
        const token = jwt.sign({ id: user.id },
            process.env.JWT_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: process.env.JWT_EXPIRES_IN
            });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};
