const express = require('express');
const { allUsers, changePassword, changePhoneNumber, deleteUser, updateUserInfo, findUser} = require("../controllers/user.controller");
const {accessRole} = require('../middlewares/role.middleware');

const router = express.Router();

router.put("/change-password", changePassword);
router.put("/change-phone", changePhoneNumber);
router.delete("/delete-user", deleteUser);
router.put("/update-info", updateUserInfo);
router.post("/find-user", accessRole(), findUser);
router.get("/all-users", accessRole(), allUsers);

module.exports = router;
