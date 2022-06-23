var express = require("express");
const Product = require("../model/Product");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("./admin/index", { title: "Panel" });
});

router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("./admin/pages/products", {
    title: "Panel",
    active: "products",
    products,
  });
});
router.get("/news", (req, res) => {
  res.render("./admin/pages/news", { title: "Panel", active: "news" });
});
router.get("/categories", (req, res) => {
  res.render("./admin/pages/categories", {
    title: "Panel",
    active: "categories",
  });
});
router.get("/partners", (req, res) => {
  res.render("./admin/pages/partners", { title: "Panel", active: "partners" });
});

module.exports = router;
