const redisClient = require("../../redis");

const rateLimiter = (expiryTime, totalAttempts) => async (req, res, next) => {
  const ip = req.connection.remoteAddress;
  const counter = await redisClient.incr(ip);
  if (counter === 1) {
    await redisClient.expire(ip, expiryTime);
  }

  if (counter > totalAttempts) {
    return res
      .status(503)
      .json({ error: "Too many hits. Try again after sometime" });
  } else {
    next();
  }
};

module.exports = rateLimiter;
