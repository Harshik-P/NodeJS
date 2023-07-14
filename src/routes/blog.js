const express = require("express");

const {
  createNewBlog,
  getAllBlogs,
  getAllBlogsByUser,
  getBlogById,
} = require("../controllers/blog");

const router = express.Router();

router.post("/new-blog", createNewBlog);
router.get("/getAllBlogs", getAllBlogs);
router.get("/getAllBlogsByUser", getAllBlogsByUser);
router.get("/getBlogById", getBlogById);

module.exports = router;
