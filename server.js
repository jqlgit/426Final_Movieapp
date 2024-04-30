const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// In-memory storage for favorite movies
let favorites = [];

// Handle the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/search/:title', async (req, res) => {
  const title = req.params.title;
  const url = `http://www.omdbapi.com/?s=${title}&apikey=cbe075ed`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie data:', error);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

app.get('/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  const url = `http://www.omdbapi.com/?i=${movieId}&apikey=cbe075ed`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Add a movie to favorites
app.post('/favorites', (req, res) => {
  const { movieTitle } = req.body;
  favorites.push(movieTitle);
  res.sendStatus(200);
});

// Get favorite movies
app.get('/favorites', (req, res) => {
  res.json(favorites);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});