import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required",
      });
    }
    const existingcategory = await categoryModel.findOne({ name });
    if (existingcategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "new Category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

//Update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Update Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in update category",
      error,
    });
  }
};

//get All Cotaegory
export const getAllCategoryController = async (req, res) => {
  try {
    const categorys = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Category List",
      categorys,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in Category",
      error,
    });
  }
};

//get one category
export const getOneCategoryController = async (req, res) => {
  try {
    const categ = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "single Category is",
      categ,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "error in category",
      error,
    });
  }
};

//delete category

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Delete category Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in delete Category",
      error,
    });
  }
};
