const express = require('express');
const {addRole, deleteRole} = require("../controllers/role.controller");

const router = express.Router();

router.post('/add', addRole);
router.delete('/delete', deleteRole)

module.exports = router;
