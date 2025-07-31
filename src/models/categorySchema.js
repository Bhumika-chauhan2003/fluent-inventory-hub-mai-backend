const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: Number
  },
  categoryName: {
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

// Add auto-increment plugin for categoryId
categorySchema.plugin(AutoIncrement, {
  inc_field: 'categoryId',
  start_seq: 1
});

module.exports = mongoose.model('Category', categorySchema);