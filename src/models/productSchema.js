const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productId: {
      type: Number,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    specification: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    eanCode: {
      type: String,
      trim: true,
      // unique: true,
      sparse: true,
    },
    shortCode: {
      type: String,
      trim: true,
      // unique: true,
      sparse: true,
    },
    productFamilyCode: {
      type: String,
      trim: true,
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
    },
    margin: {
      type: Number,
      default: null,
    },
    entryDate: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
    addedOn: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
    invoiceProduct: {
      type: Number,
      default: 0,
    },
    remainingProduct: {
      type: Number,
      default: function () {
        return this.quantity - this.invoiceProduct;
      },
    },
    billingSellingPrice: {
      type: Number,
      default: function () {
        return this.sellingPrice;
      },
    },
    unitName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Automatically calculate remainingProduct before save
productSchema.pre("save", function (next) {
  this.remainingProduct = this.quantity - this.invoiceProduct;
  next();
});

// Apply auto-increment plugin
productSchema.plugin(AutoIncrement, { inc_field: "productId" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
