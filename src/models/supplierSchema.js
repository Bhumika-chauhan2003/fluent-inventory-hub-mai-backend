const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const supplierSchema = new mongoose.Schema({
  supplierId: {
    type: Number,
    unique: true
  },
  supplierName: {
    type: String,
    required: true,
    trim: true
  },
  supplierContact: {
    type: String,
    required: true,
    trim: true
  },
  addedBy: {
    type: String,
    required: true
  },
  addedOn: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    default: null
  },
  modifiedOn: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  }
});

// 👇 Auto-increment supplierId starting from 1
supplierSchema.plugin(AutoIncrement, { inc_field: 'supplierId' });

module.exports = mongoose.model('Supplier', supplierSchema);