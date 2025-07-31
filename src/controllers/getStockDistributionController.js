const productSchema = require('../models/productSchema');

//Route: GET /api/reports/stock-distribution?action=stockDistribution

const getStockDistributionController = async (req, res) => {
  const { action } = req.query;
  if (action !== 'stockDistribution') return res.status(400).json({ error: 'Invalid action' });

  try {
    const distribution = await productSchema.aggregate([
      { $match: { active: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData'
        }
      },
      { $unwind: '$categoryData' },
      {
        $group: {
          _id: '$categoryData.name',
          totalStock: { $sum: '$quantity' }
        }
      }
    ]);

    return res.json(distribution);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch stock distribution' });
  }
};

module.exports = getStockDistributionController;