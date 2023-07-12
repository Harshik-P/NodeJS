const Joi = require("joi");

const userSchema = Joi.object({
  userName: Joi.string().min(3).max(20).required(),
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

module.exports = {
  validateUserData,
};
