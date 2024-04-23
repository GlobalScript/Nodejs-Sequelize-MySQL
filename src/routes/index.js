const express = require('express');
const authRoute = require("./auth.route");
const userRoute =  require("./user.route");
const roleRoute = require("./role.route");
const {authenticateUser} = require("../middlewares/auth.middleware");

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', authenticateUser, userRoute);
router.use('/role', authenticateUser, roleRoute);

module.exports = router;
