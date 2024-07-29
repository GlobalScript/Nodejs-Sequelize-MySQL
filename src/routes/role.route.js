const express = require('express');
const {addRole, deleteRole, addAdminRole, deleteAdminRole} = require("../controllers/role.controller");
const {Roles} = require('../config/constants');
const {accessRole} = require("../middlewares/role.middleware");

const router = express.Router();

router.post('/add-admin', addAdminRole);
router.delete('/delete-admin', deleteAdminRole);
router.post('/add-role', accessRole(Roles.ADMIN), addRole);
router.delete('/delete-role', accessRole(Roles.ADMIN), deleteRole)

module.exports = router;
