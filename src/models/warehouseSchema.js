const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const warehouseSchema = new mongoose.Schema({
  warehouseId: {
    type: Number,
    unique: true
  },
  warehouseName: {
    type: String,
    required: true,
    trim: true
  },
  warehouseLocation: {
    type: String,
    trim: true,
    default: ''
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
  timestamps: true // Automatically adds createdAt & updatedAt
});

// Auto-increment warehouseId field
warehouseSchema.plugin(AutoIncrement, { inc_field: 'warehouseId' });

module.exports = mongoose.model('Warehouse', warehouseSchema);