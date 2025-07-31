const productSchema = require('../models/productSchema');


//Route: GET /api/dashboard/insights?action=insights

const getInventoryInsightsController = async (req, res) => {
  const { action } = req.query;
  if (action !== 'insights') return res.status(400).json({ error: 'Invalid action' });

  try {
    const lowStock = await productSchema.find({ remainingProduct: { $lt: 5 }, active: true });
    const highValue = await productSchema.aggregate([
      { $match: { active: true } },
      {
        $addFields: { value: { $multiply: ['$purchasePrice', '$quantity'] } }
      },
      { $sort: { value: -1 } },
      { $limit: 5 }
    ]);

    return res.json({ lowStock, highValue });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch insights' });
  }
};
module.exports =  getInventoryInsightsController