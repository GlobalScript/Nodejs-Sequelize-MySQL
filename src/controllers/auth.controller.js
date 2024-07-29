const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const {Roles} = require('../config/constants');

exports.signUp = async (req, res) => {
    const { password, nickname, confirmPassword, phone, firstname, lastname, avatar } = req.body;
    if (!password || !nickname || !confirmPassword || !phone || !firstname || !lastname) {
        return res.status(400).json({ error: 'All the required properties must be specified: nickname, phone, password, confirmPassword, firstname, lastname' });
    }
    const role = await db.role.findByPk(Roles.USER);
    if (!role) {
        return res.status(400).send({message: "The list of roles in the database is missing"});
    }
    if (password.length < 6) {
        return res.status(400).send({ error: 'Password must be at least 6 characters long' });
    }
    if (password !== confirmPassword) {
        return res.status(400).send({ error: 'confirmPassword do not match' });
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
        await user.addRole(role);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send(err.errors);
    }
};


exports.signIn = async (req, res) => {
    const { nickname, password } = req.body;
    if (!nickname || !password) {
        return res.status(400).json({ error: 'All the required properties must be specified: nickname, password' });
    }
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
