const productSchema = require('../models/productSchema');


//Route: POST /api/reports/inventory-value
// Body: { "action": "inventoryValueChart" }

const getInventoryValueReportController = async (req, res) => {
  const { action } = req.body;
  if (action !== 'inventoryValueChart') return res.status(400).json({ error: 'Invalid action' });

  try {
    const result = await productSchema.aggregate([
      { $match: { active: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      {
        $unwind: '$categoryData'
      },
      {
        $group: {
          _id: '$categoryData.name',
          inventoryValue: { $sum: { $multiply: ['$purchasePrice', '$quantity'] } }
        }
      }
    ]);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate inventory value chart' });
  }
};
module.exports = getInventoryValueReportController;
