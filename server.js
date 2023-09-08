const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000; // Set the desired port number for your server
// const dbURI = 'mongodb://deepak:deepak@127.0.0.1:27017/mydatabase';
const dbURI = 'mongodb+srv://chimtu:chimtu$143@cluster1.jjirlsu.mongodb.net/?retryWrites=true&w=majority'
 // Replace 'mydatabase' with your actual database name

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successfully connecting to the database
    app.listen(port, '127.0.0.1', () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Parse JSON bodies for this server
app.use(express.json());

// Import the Entry model and other modules as needed
const Entry = require('./models/Entry');

// Add CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Set the appropriate origin here
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Define a route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Journal App!');
});

// Create a new journal entry
app.post('/api/entries', (req, res) => {
  // Extract the data from the request body
  const { title, content } = req.body;

  // Create a new entry instance
  const entry = new Entry({ title, content });

  // Save the entry to the database
  entry.save()
    .then((savedEntry) => {
      res.json(savedEntry);
    })
    .catch((error) => {
      console.error('Error creating entry:', error);
      res.status(500).json({ error: 'An error occurred while creating the entry.' });
    });
});

// Get all journal entries
app.get('/api/entries', (req, res) => {
  // Fetch all entries from the database
  Entry.find()
    .then((entries) => {
      res.json(entries);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while fetching the entries.' });
    });
});

// Get a specific journal entry by ID
app.get('/api/entries/:id', (req, res) => {
  const entryId = req.params.id;

  // Fetch the entry by ID from the database
  Entry.findById(entryId)
    .then((entry) => {
      if (!entry) {
        return res.status(404).json({ error: 'Entry not found.' });
      }
      res.json(entry);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while fetching the entry.' });
    });
});

// Update a journal entry by ID
app.put('/api/entries/:id', (req, res) => {
  const entryId = req.params.id;
  const { title, content } = req.body;

  // Find the entry by ID and update its title and content
  Entry.findByIdAndUpdate(entryId, { title, content }, { new: true })
    .then((updatedEntry) => {
      if (!updatedEntry) {
        return res.status(404).json({ error: 'Entry not found.' });
      }
      res.json(updatedEntry);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while updating the entry.' });
    });
});

// Delete a journal entry by ID
app.delete('/api/entries/:id', (req, res) => {
  const entryId = req.params.id;

  // Find the entry by ID and delete it
  Entry.findByIdAndDelete(entryId)
    .then((deletedEntry) => {
      if (!deletedEntry) {
        return res.status(404).json({ error: 'Entry not found.' });
      }
      res.json({ message: 'Entry deleted successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while deleting the entry.' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
