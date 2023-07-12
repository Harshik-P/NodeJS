const express = require("express");

const { validateUserData } = require("../middlewares/user");
const {
  register,
  login,
  findUserById,
  getAllUsers,
  updateUserDataById,
  deleteUserById,
  changePassword,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", validateUserData, register);
router.post("/login", login);
router.get("/getAllUsers", getAllUsers);
router.get("/:id", findUserById);
router.put("/:id/updateUser", validateUserData, updateUserDataById);
router.put("/:id/change-password", changePassword);
router.delete("/:id/deleteUser", deleteUserById);

module.exports = router;
