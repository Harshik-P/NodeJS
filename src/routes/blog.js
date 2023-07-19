const express = require("express");

const rateLimiter = require("../helpers/rateLimiter");
const {
  createNewBlog,
  getAllBlogs,
  getAllBlogsByUser,
  getBlogById,
} = require("../controllers/blog");

const router = express.Router();

router.post("/new-blog", rateLimiter(60, 10), createNewBlog);
router.get("/getAllBlogs", rateLimiter(60, 10), getAllBlogs);
router.get("/getAllBlogsByUser", rateLimiter(60, 10), getAllBlogsByUser);
router.get("/getBlogById", rateLimiter(60, 10), getBlogById);

module.exports = router;
