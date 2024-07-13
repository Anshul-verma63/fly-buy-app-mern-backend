import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModal from "../models/categoryModel.js";
import fs from "fs";

//create product
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "name is requires" });

      case !description:
        return res.status(500).send({ message: "description is requires" });

      case !price:
        return res.status(500).send({ message: "price is requires" });

      case !category:
        return res.status(500).send({ message: "category is requires" });

      case !quantity:
        return res.status(500).send({ message: "quantity is requires" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is requires and less then 1mb" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in product Creation",
      error,
    });
  }
};
//get all product

export const getproductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      totalProduct: product.length,
      message: "All Products",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in get product",
      error,
    });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "product get successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "erron in get product",
      error,
    });
  }
};

//get photo

export const getPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error while get photo",
      error,
    });
  }
};

//delete product

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error while delete product",
      error,
    });
  }
};

//update product

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is requires" });

      case !description:
        return res.status(500).send({ error: "description is requires" });

      case !price:
        return res.status(500).send({ error: "price is requires" });

      case !category:
        return res.status(500).send({ error: "category is requires" });

      case !quantity:
        return res.status(500).send({ error: "quantity is requires" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is requires and less then 1mb" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error while update product",
      error,
    });
  }
};

// filters product
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "Product filter successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error while filternig product",
      error,
    });
  }
};

//count product
export const countProductController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Product count successfully",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error while count product",
      error,
    });
  }
};

//product per page
export const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    const product = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error while listing product",
      error,
    });
  }
};

// search product controller
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error while search product",
      error,
    });
  }
};

//similar product controller
export const similarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error while fetch similar product",
      error,
    });
  }
};

// category wise product
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModal.findOne({ slug: req.params.slug });
    const product = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      product,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error while fetch product category wise",
      error,
    });
  }
};
