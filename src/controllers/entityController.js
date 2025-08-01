const ENTITY_CONFIG = require('../config/entityConfig');

// ======= LIST ENTITIES =======
const listEntitiesController = async (req, res) => {
  const { entity } = req.params;
  const { action, active, id } = req.query;

  if (action !== 'list') {
    return res.status(400).json({ message: 'Invalid action parameter' });
  }

  const Model = ENTITY_CONFIG[entity.toLowerCase()];
  if (!Model) return res.status(400).json({ message: 'Invalid entity type' });

  try {
    const query = {};
    if (id) query._id = id;
    if (typeof active !== 'undefined') query.active = active === 'true';

    const results = await Model.find(query).populate('category supplier unit warehouse');
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ======= CREATE ENTITY =======
const createEntityController = async (req, res) => {
  const { entity } = req.params;
  const { action, ...data } = req.body;

  if (action !== 'insert') return res.status(400).json({ message: 'Invalid action for insert' });

  const Model = ENTITY_CONFIG[entity.toLowerCase()];
  if (!Model) return res.status(400).json({ message: 'Invalid entity type' });

  try {
    const newRecord = new Model(data);
    const saved = await newRecord.save();
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ======= UPDATE ENTITY =======
const updateEntityController = async (req, res) => {
  const { entity } = req.params;
  const { action, id, ...data } = req.body;

  if (action !== 'update' || !id) return res.status(400).json({ message: 'Invalid update parameters' });

  const Model = ENTITY_CONFIG[entity.toLowerCase()];
  if (!Model) return res.status(400).json({ message: 'Invalid entity type' });

  try {
    data.modifiedOn = new Date();
    const updated = await Model.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return res.status(404).json({ message: 'Record not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ======= DELETE ENTITY =======
const deleteEntityController = async (req, res) => {
  const { entity } = req.params;
  const { action, id } = req.body;

  if (action !== 'delete' || !id) return res.status(400).json({ message: 'Invalid delete parameters' });

  const Model = ENTITY_CONFIG[entity.toLowerCase()];
  if (!Model) return res.status(400).json({ message: 'Invalid entity type' });

  try {
    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Record not found' });
    res.json({ success: true, message: 'Deleted successfully', data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  listEntitiesController,
  createEntityController,
  updateEntityController,
  deleteEntityController
};
