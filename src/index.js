const express = require("express");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/blog", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
