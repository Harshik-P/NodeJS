const { v4: uuidv4 } = require("uuid");

const Blogs = require("../../models/blogs");

const createNewBlog = async (req, res) => {
  try {
    const { username, description } = req.body;
    const blogId = uuidv4();
    const blog = await Blogs.create({
      blogId: blogId,
      createdByUser: username,
      description: description,
    });
    return res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.findAll();
    if (blogs.length > 0) {
      return res.status(201).json(blogs);
    } else {
      return res.json({ message: "No blogs found." });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const getAllBlogsByUser = async (req, res) => {
  try {
    const { username } = req.body;
    const blogs = await Blogs.findAll({
      where: {
        createdByUser: username,
      },
    });
    if (blogs.length > 0) {
      return res.status(201).json(blogs);
    } else {
      return res.json({ message: "The User doesn't have any blogs yet." });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.body;
    const blog = await Blogs.findOne({
      where: {
        blogId: blogId,
      },
    });
    if (blog) {
      return res.status(201).json(blog);
    } else {
      return res.json({ message: "The blogId doesn't exist." });
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

module.exports = {
  createNewBlog,
  getAllBlogs,
  getAllBlogsByUser,
  getBlogById,
};
