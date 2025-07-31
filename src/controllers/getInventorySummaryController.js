const productSchema = require("../models/productSchema");
//Route: GET /api/dashboard/summary?action=summary

const getInventorySummaryController = async (req, res) => {
  const { action } = req.query;
  if (action !== "summary")
    return res.status(400).json({ error: "Invalid action" });

  try {
    const totalProducts = await productSchema.countDocuments({ active: true });
    const totalStock = await productSchema.aggregate([
      { $match: { active: true } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);
    const totalValue = await productSchema.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: null,
          inventoryValue: {
            $sum: { $multiply: ["$purchasePrice", "$quantity"] },
          },
        },
      },
    ]);

    return res.json({
      totalProducts,
      totalStock: totalStock[0]?.totalQuantity || 0,
      totalInventoryValue: totalValue[0]?.inventoryValue || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
};

module.exports = getInventorySummaryController;
