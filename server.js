const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static('public'));

// Handle the root route
app.get('/', (req, res) => {
    res.status(400).send('get/ worked');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/search/:title', async (req, res) => {
  const title = req.params.title;
  const url = `http://www.omdbapi.com/?s=${title}&apikey=fc1fef96`;

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
  const url = `http://www.omdbapi.com/?i=${movieId}&apikey=fc1fef96`;

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
    const { movieId, movieTitle } = req.body;
  
    // Store the movie in the user's favorites (e.g., in a database or file)
    // Example using a file-based storage:
    let favorites = [];
    if (fs.existsSync('favorites.json')) {
      favorites = JSON.parse(fs.readFileSync('favorites.json', 'utf8'));
    }
    favorites.push({ movieId, movieTitle });
    fs.writeFileSync('favorites.json', JSON.stringify(favorites));
  
    res.sendStatus(200);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});