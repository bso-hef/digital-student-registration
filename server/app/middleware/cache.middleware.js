import redisClient from "../../config/redis.js";

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;

  redisClient.get(key, (err, data) => {
    if (err) return next(err);

    if (data !== null && data !== undefined) {
      res.status(200).json(JSON.parse(data));
    } else {
      next();
    }
  });
};

export default cacheMiddleware;
