const express = require('express');
const Entry = require('../models/Entry');
const router = express.Router();

// Create a new entry
router.post('/', (req, res) => {
  const { title, content } = req.body;

  const newEntry = new Entry({
    title,
    content,
  });

  newEntry.save()
    .then((entry) => {
      res.json(entry);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});
// Get all entries
router.get('/', (req, res) => {
  Entry.find()
    .then((entries) => {
      res.json(entries);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Get a single entry
router.get('/:id', (req, res) => {
  const { id } = req.params;

  Entry.findById(id)
    .then((entry) => {
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      res.json(entry);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Update an entry
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  Entry.findByIdAndUpdate(id, { title, content }, { new: true })
    .then((entry) => {
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      res.json(entry);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

// Delete an entry
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Entry.findByIdAndDelete(id)
    .then((entry) => {
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      res.json({ message: 'Entry deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

export default router;
