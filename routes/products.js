const express = require("express");
const Product = require("../model/Product");
const router = express.Router();
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const path = require("path")
const fs = require("fs")

// Upload functions

const image_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/products/");
  },
  filename: function (req, file, cb) {
    const image_fileName = Date.now() + file.originalname.split(" ").join("-");
    cb(null, `${image_fileName}`);
  },
});

const upload = multer({ storage: image_storage });
const multiUpload = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
  { name: "image5", maxCount: 1 },
  { name: "image6", maxCount: 1 },
  { name: "image7", maxCount: 1 },
])

router.get("/products", async (req, res) => {
  res.render("products");
});

router.get("/products/add", async (req, res) => {
  res.render("pages/add-product");
});

router.post(
  "/products/add",
  multiUpload,
  [
    check("nameuz")
      .isLength({ min: 3, max: 150 })
      .withMessage("Nomini kiriting."),
    check("fulltextuz")
      .isLength({ min: 3, max: 150 })
      .withMessage("Matnni to'ldiring."),
    check("price")
      .isNumeric({ min: 0, max: 150 })
      .withMessage("Narxini kiriting."),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    let hasError = !errors.isEmpty();
    const imagesArr = []
    if (req.files['image1']) imagesArr.push(req.files["image1"]["0"])
    if (req.files['image2']) imagesArr.push(req.files["image2"]["0"])
    if (req.files['image3']) imagesArr.push(req.files["image3"]["0"])
    if (req.files['image4']) imagesArr.push(req.files["image4"]["0"])
    if (req.files['image5']) imagesArr.push(req.files["image5"]["0"])
    if (req.files['image6']) imagesArr.push(req.files["image6"]["0"])
    if (req.files['image7']) imagesArr.push(req.files["image7"]["0"])

    if (imagesArr.length === 0) {
      let imgError = {
        value: "",
        msg: "Rasm yuklanmadi",
        param: "image1",
        location: "body"
      }
      // console.log(imgError); 
      errors.errors.push(imgError)
    }

    if (hasError) {


      // Images delete
      if (imagesArr) {
        for (let i = 0; i < imagesArr.length; i++) {
          let pathh = path.join(
            __dirname,
            `../public/images/products${imagesArr[i].filename}`
          )
          console.log(pathh);
          if (fs.existsSync(path)) {
            fs.unlink(path.join(pathh), (err) => {
              if (err) console.log(err);
              console.log("Fotosurat o'chirildi");
            });
          }
          // console.log(imagesArr);
        }
      }
      return res.render("pages/add-product", {
        errors: errors.errors,
      });
    }
    const {
      nameuz,
      nameru,
      nameen,
      fulltextuz,
      fulltextru,
      fulltexten,
      price,
    } = req.body;



    const product = new Product({
      name: { 
      uz: nameuz, 
      ru: nameru ? nameru : nameuz, 
      en: nameen ? nameen : nameuz 
      },
      image: imagesArr,
      fulltext: { 
      uz: fulltextuz,
      ru: fulltextru ? fulltextru : fulltextuz, 
      en: fulltexten ? fulltexten : fulltextuz },
      price: price,
    });
    console.log(product);
    product.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Mahsulot qo'shildi.");
        req.flash("alert alert-success", "Mahsulot yaratildi");
        res.redirect("/");
      }
    });
  }
);

router.get("product/edit/:id" , async(req,res) => {
  const product = await Product .findById(req.params.id)
  res.render("./pages/add-product" , {product , edit: true})
})

router.get("/products/:id", async (req, res) => {
  res.render("product-id");
});

module.exports = router;
