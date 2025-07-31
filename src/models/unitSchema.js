const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const unitSchema = new mongoose.Schema({
  unitId: {
    type: Number,
    unique: true
  },
  unitName: {
    type: String,
    required: true,
    trim: true
  },
  unitAbbreviation: {
    type: String,
    trim: true
  },
  addedBy: {
    type: String,
    trim: true
  },
  addedOn: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    trim: true,
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
}, {
  timestamps: true
});

// Auto-increment unitId
unitSchema.plugin(AutoIncrement, { inc_field: 'unitId' });

module.exports = mongoose.model('Unit', unitSchema);

