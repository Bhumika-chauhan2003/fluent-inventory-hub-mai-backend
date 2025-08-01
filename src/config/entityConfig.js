const categorySchema = require('../models/categorySchema');
const supplierSchema = require('../models/supplierSchema');
const warehouseSchema = require('../models/warehouseSchema');
const unitSchema = require('../models/unitSchema');
const customerSchema = require('../models/customerSchema');
const productSchema = require('../models/productSchema');

const ENTITY_CONFIG = {
  category: categorySchema,
  supplier: supplierSchema,
  warehouse: warehouseSchema,
  unit: unitSchema,
  customer: customerSchema,
  product: productSchema
};

module.exports = ENTITY_CONFIG;