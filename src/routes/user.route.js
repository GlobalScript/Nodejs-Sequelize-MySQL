const express = require('express');
const { allUsers, changePassword, changePhoneNumber, deleteUser, updateUserInfo, findUser} = require("../controllers/user.controller");

const router = express.Router();

router.put("/change-password", changePassword);
router.put("/change-phone", changePhoneNumber);
router.delete("/delete", deleteUser);
router.put("/update", updateUserInfo);
router.post("/find", findUser);
router.get("/all", allUsers);

module.exports = router;
