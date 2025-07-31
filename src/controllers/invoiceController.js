const invoiceSchema = require('../models/invoiceSchema');

// GET /api/invoices?action=invoice&InvoiceNumber=optional
const getInvoicesController = async (req, res) => {
  const { action, InvoiceNumber } = req.query;

  if (action !== 'invoice') {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    if (InvoiceNumber) {
      const invoice = await invoiceSchema.findOne({ invoiceNumber: InvoiceNumber, active: true });
      return res.json(invoice || {});
    } else {
      const invoices = await invoiceSchema.find({ active: true });
      return res.json(invoices);
    }
  } catch (err) {
    console.error('Error fetching invoices:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/invoices
const createInvoiceController = async (req, res) => {
  const {
    action,
    invoiceNumber,
    date,
    customerNif,
    customerName,
    contact,
    address,
    productId,
    productName,
    quantity,
    price,
    total,
    discount,
    tax,
    grandTotal,
    addedOn
  } = req.body;

  if (action !== 'invoice') {
    return res.status(400).json({ error: 'Invalid action' });
  }

  try {
    // Check for existing invoiceNumber
    const existing = await invoiceSchema.findOne({ invoiceNumber });
    if (existing) {
      return res.status(400).json({ error: 'Invoice already exists' });
    }

    const newInvoice = new invoiceSchema({
      invoiceNumber,
      date,
      customerNif,
      customerName,
      contact,
      address,
      productId,
      productName,
      quantity,
      price,
      total,
      discount,
      tax,
      grandTotal,
      addedOn: addedOn || new Date(), // fallback if not provided
      active: true
    });

    await newInvoice.save();
    return res.json({ message: 'Invoice created successfully', invoiceId: newInvoice.invoiceId });
  } catch (err) {
    console.error('Error creating invoice:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/invoices?action=deleteinvoice&InvoiceNumber=...
const deleteInvoiceController = async (req, res) => {
  const { action, InvoiceNumber } = req.query;

  if (action !== 'deleteinvoice' || !InvoiceNumber) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const result = await invoiceSchema.updateOne(
      { invoiceNumber: InvoiceNumber, active: true },
      { $set: { active: false } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Invoice not found or already inactive' });
    }

    return res.json({ message: 'Invoice marked as deleted (inactive)' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getInvoicesController,
  createInvoiceController,
  deleteInvoiceController
};
