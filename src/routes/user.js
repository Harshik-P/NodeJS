const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

const userSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

const validateUserData = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.sendStatus(400).json({ error: error });
  }
  next();
};

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users) {
      res.status(404).json({ error: "No Users found" });
    } else {
      res.json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateUserData, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    console.log("successfully");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", validateUserData, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await User.findByPk(id);
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = hashedPassword;
      }
      user.update();
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      user.destroy();
      res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/change-password", async (req, res) => {
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
        res.json({ message: "Password changed successfully" });
      }
    } else {
      res.json({
        message: "The entered password is matching with the current password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
