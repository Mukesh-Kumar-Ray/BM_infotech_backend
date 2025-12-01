// **** Routes for creating/managing forms and responses
import express from 'express';
import Form from '../models/form.model.js';
import Response from '../models/response.model.js';
const router = express.Router();

const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

// Helper: simple admin check via passphrase in body header - beginner-friendly
function checkAdmin(req, res, next) {
  const pass = req.headers['x-admin-pass'] || req.body.adminPass;
  if (pass === ADMIN_PASS) return next();
  return res.status(401).json({ message: 'Unauthorized: invalid admin pass' });
}

// Create form (admin)
router.post('/', checkAdmin, async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all forms (admin or public listing)
router.get('/', async (req, res) => {
  const forms = await Form.find().sort({ createdAt: -1 });
  res.json(forms);
});

// Get single form by id (for rendering to user)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update form (admin)
router.put('/:id', checkAdmin, async (req, res) => {
  try {
    const updated = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Duplicate a form (admin)
router.post('/:id/duplicate', checkAdmin, async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    const copy = new Form({
      title: form.title + ' (copy)',
      description: form.description,
      fields: form.fields,
      style: form.style
    });
    await copy.save();
    res.json(copy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete form (admin)
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    // optionally delete responses too
    await Response.deleteMany({ formId: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit response (public)
router.post('/:id/response', async (req, res) => {
  try {
    const resp = new Response({
      formId: req.params.id,
      answers: req.body.answers || {}
    });
    await resp.save();
    res.status(201).json({ message: 'Submitted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get responses for a form (admin)
router.get('/:id/responses', checkAdmin, async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.id }).sort({ submittedAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
