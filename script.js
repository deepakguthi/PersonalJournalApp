const fetch = require('node-fetch');

// Function to fetch and update the entry listing
async function updateEntryListing() {
  try {
    // Fetch entries from the backend API
    const response = await fetch('http://127.0.0.1:3000/api/entries');
    const entries = await response.json();

    // Get the entry listing container
    const entryListContainer = document.getElementById('entry-list-container');
    entryListContainer.innerHTML = ''; // Clear the container

    // Iterate over the entries and create HTML elements for each entry
    entries.forEach(entry => {
      // Create a list item for the entry
      const entryListItem = document.createElement('li');

      // Create HTML elements for title, content, date, etc.
      const titleElement = document.createElement('h3');
      titleElement.textContent = entry.title;

      const contentElement = document.createElement('p');
      contentElement.textContent = entry.content;

      const dateElement = document.createElement('p');
      dateElement.textContent = entry.date;

      // Append the elements to the list item
      entryListItem.appendChild(titleElement);
      entryListItem.appendChild(contentElement);
      entryListItem.appendChild(dateElement);

      // Append the list item to the entry listing container
      entryListContainer.appendChild(entryListItem);
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the form input values
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  // Create a new journal entry object
  const newEntry = { title, content };

  try {
    // Make a POST request to the backend API to create the entry
    const response = await fetch('http://localhost:3000/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEntry)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Entry created:', data);

      // Clear the form input values
      document.getElementById('title').value = '';
      document.getElementById('content').value = '';

      // Update the entry listing
      updateEntryListing();
    } else {
      throw new Error('Error creating entry');
    }
  } catch (error) {
    console.error('Error creating entry:', error);
  }
}

// Add event listener to the form
document.getElementById('entry-form').addEventListener('submit', handleFormSubmit);

// Update the entry listing initially
updateEntryListing();
