const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const { sendEmailUsingSendgrid } = require("../helpers/sendgrid");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token = jwt.sign({ userName: user.userName }, SECRET_KEY, {
        expiresIn: "3h",
      });
      res.cookie("auth_token", token);
      sendEmailUsingSendgrid(email, userName);
    }

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    if (user) {
      const isPasswordMatched = bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
        const token = jwt.sign({ userName: user.userName }, SECRET_KEY, {
          expiresIn: "3h",
        });
        res.cookie("auth_token", token);
        return res.status(201).json(user);
      } else {
        return res.json({ error: "Incorrect password" });
      }
    } else {
      return res.json({ error: "User does not exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users) {
      return res.status(404).json({ error: "No Users found" });
    } else {
      return res.json(users);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json(user);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      if (userName) {
        user.userName = userName;
      }
      if (email) {
        user.email = email;
      }
      user.update();
      return res.json(user);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      user.destroy();
      return res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password: newPassword } = req.body;
    const user = await User.findByPk(id);
    const isPasswordSameAsOld = await bcrypt.compare(
      newPassword,
      user.password
    );
    if (!isPasswordSameAsOld) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const changedPass = await user.update({
        password: hashedPassword,
      });
      if (changedPass) {
        return res.json({ message: "Password changed successfully" });
      }
    } else {
      return res.json({
        message: "The entered password is matching with the current password",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  findUserById,
  getAllUsers,
  updateUserDataById,
  deleteUserById,
  changePassword,
};
