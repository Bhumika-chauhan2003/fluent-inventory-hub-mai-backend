const invoiceSchema = require('../models/invoiceSchema');


// Route: GET /api/reports/monthly-sales?action=ChartReport

const getMonthlySalesReportController = async (req, res) => {
  const { action } = req.query;
  if (action !== 'ChartReport') return res.status(400).json({ error: 'Invalid action' });

  try {
    const result = await invoiceSchema.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          totalSales: { $sum: '$grandTotal' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate monthly sales report' });
  }
};
module.exports = getMonthlySalesReportController;
