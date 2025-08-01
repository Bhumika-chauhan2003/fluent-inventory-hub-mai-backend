const productSchema = require("../models/productSchema");

// ====== GET Controller: Get Products or a Single Product by productId ======
const getProductsController = async (req, res) => {
  try {
    const { action, productid } = req.query;

    // Validate 'action' query param
    if (!action || action.toLowerCase() !== "product") {
      return res.status(400).json({ message: "Invalid or missing 'action' parameter. Use action=product" });
    }

    // If productid is provided, return single product
    if (productid) {
      const product = await productSchema
        .findOne({ productId: productid, active: true })
        .populate("category supplier unit warehouse");

      if (!product) {
        return res.status(404).json({ message: `Product with ID '${productid}' not found.` });
      }

      return res.status(200).json({ success: true, data: product });
    }

    // Else, return all products
    const products = await productSchema
      .find({ active: true })
      .populate("category supplier unit warehouse");

    return res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ====== POST/PUT Controller ======
const createOrUpdateProductController = async (req, res) => {
  try {
    const { action, productId } = req.body;

    if (action !== "product") {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Input validation
    const {
      productName,
      eanCode,
      shortCode,
      sellingPrice,
      purchasePrice,
      quantity,
      taxRate,
      category,
      supplier,
      unit,
      warehouse,
    } = req.body;

    if (
      !productName ||
      typeof productName !== "string" ||
      productName.trim().length < 2
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or missing productName" });
    }

    if (eanCode && !/^[0-9]{8,14}$/.test(eanCode)) {
      return res
        .status(400)
        .json({ message: "EAN Code must be 8 to 14 digits" });
    }

    if (shortCode && !/^[a-zA-Z0-9-_]{2,20}$/.test(shortCode)) {
      return res.status(400).json({ message: "Invalid shortCode format" });
    }

    if (
      purchasePrice < 0 ||
      sellingPrice < 0 ||
      quantity < 0 ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      return res
        .status(400)
        .json({ message: "Invalid price, quantity or tax values" });
    }

    if (!category || !supplier || !unit || !warehouse) {
      return res.status(400).json({ message: "Missing required references" });
    }

    // UPDATE
    if (productId) {
      const updated = await productSchema.findOneAndUpdate(
        { productId },
        {
          ...req.body,
          modifiedOn: new Date(),
        },
        { new: true }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Product not found for update" });
      }

      return res
        .status(200)
        .json({ message: "Product updated successfully", data: updated });
    }

    // CREATE
    const newProduct = new productSchema({
      ...req.body,
      addedOn: new Date(),
      modifiedOn: new Date(),
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ====== DELETE Controller ======
const deleteProductController = async (req, res) => {
  try {
    const { action, productid } = req.query;

    if (action !== "deleteproduct" || !productid) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const deleted = await productSchema.findOneAndUpdate(
      { productId: productid },
      { active: false, modifiedOn: new Date() },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted (inactivated) successfully",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ====== Exports ======
module.exports = {
  getProductsController,
  createOrUpdateProductController,
  deleteProductController,
};
