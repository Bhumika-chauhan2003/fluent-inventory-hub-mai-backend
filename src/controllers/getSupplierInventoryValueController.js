const productSchema = require("../models/productSchema");

const mongoose = require("mongoose");
//Route: GET /api/reports/supplier-inventory?action=supplierInventoryValue

const getSupplierInventoryValueController = async (req, res) => {
  const { action } = req.query;
  if (action !== "supplierInventoryValue")
    return res.status(400).json({ error: "Invalid action" });

  try {
    const result = await productSchema.aggregate([
      { $match: { active: true } },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierData",
        },
      },
      { $unwind: "$supplierData" },
      {
        $group: {
          _id: "$supplierData.supplierName",
          inventoryValue: {
            $sum: { $multiply: ["$purchasePrice", "$quantity"] },
          },
        },
      },
    ]);

    return res.json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch supplier inventory value" });
  }
};
module.exports = getSupplierInventoryValueController;
