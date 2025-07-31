const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const customerSchema = new mongoose.Schema({
  customerId: {
    type: Number,
    unique: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerAddress: {
    type: String,
    required: true,
    trim: true
  },
  customerContactNo: {
    type: String,
    required: true,
    trim: true
  },
  customerDescription: {
    type: String,
    trim: true
  },
  customerNif: {
    type: String,
    trim: true
  },
  addedBy: {
    type: String,
    required: true,
    trim: true
  },
  addedOn: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    default: null,
    trim: true
  },
  modifiedOn: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-increment plugin for customerId
customerSchema.plugin(AutoIncrement, { inc_field: 'customerId' });

module.exports = mongoose.model('Customer', customerSchema);