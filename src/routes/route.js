const express = require('express');
const router = express.Router();

const {
  getProductsController,
  createOrUpdateProductController,
  deleteProductController
} = require('../controllers/productController');

const {
  getInvoicesController,
  createInvoiceController,
  deleteInvoiceController
} = require('../controllers/invoiceController');

const {
  listEntitiesController,
  createEntityController,
  updateEntityController,
  deleteEntityController
} = require('../controllers/entityController');

const getInventorySummaryController = require('../controllers/getInventorySummaryController');
const getInventoryInsightsController = require('../controllers/getInventoryInsightsController');
const getInventoryValueReportController = require('../controllers/getInventoryValueReportController');
const getStockDistributionController = require('../controllers/getStockDistributionController');
const getSupplierInventoryValueController = require('../controllers/getSupplierInventoryValueController');
const getMonthlySalesReportController = require('../controllers/getMonthlySalesReportController');

// Root route for health check or welcome
router.get('/', (req, res) => {
  res.send('Hello from Express + MongoDB backend!');
});

// Product routes
router.get('/products', getProductsController);
router.post('/products', createOrUpdateProductController);
router.delete('/products', deleteProductController);

// Invoice routes
router.get('/invoices', getInvoicesController);
router.post('/invoices', createInvoiceController);
router.delete('/invoices', deleteInvoiceController);

// Dashboard summary & insights
router.get('/summary', getInventorySummaryController); // ?action=summary
router.get('/insights', getInventoryInsightsController); // ?action=insights

// Reports
router.post('/inventory-value', getInventoryValueReportController); // body: { action: "inventoryValueChart" }
router.get('/stock-distribution', getStockDistributionController);  // ?action=stockDistribution
router.get('/supplier-inventory', getSupplierInventoryValueController); // ?action=supplierInventoryValue
router.get('/monthly-sales', getMonthlySalesReportController); // ?action=ChartReport&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

// GET: List records
router.get('/:entity', listEntitiesController);

// POST: Insert, Update, Delete based on action
router.post('/:entity', async (req, res, next) => {
  const { action } = req.body;

  switch (action) {
    case 'insert':
      return createEntityController(req, res);
    case 'update':
      return updateEntityController(req, res);
    case 'delete':
      return deleteEntityController(req, res);
    default:
      return res.status(400).json({ message: 'Invalid action in request body' });
  }
});


module.exports = router;

