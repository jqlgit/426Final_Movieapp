const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const favoriteMoviesList = document.getElementById('favorite-movies-list');

// Load movies from server
async function loadMovies(searchTerm) {
  const response = await fetch(`/search/${searchTerm}`);
  const data = await response.json();
  if (data.Response === "True") {
    displayMovieList(data.Search);
  }
}

function findMovies() {
  let searchTerm = (movieSearchBox.value).trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  } else {
    searchList.classList.add('hide-search-list');
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in data-id
    movieListItem.classList.add('search-list-item');
    let moviePoster = movies[idx].Poster !== "N/A" ? movies[idx].Poster : "image_not_found.png";

    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}</p>
      </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

// Load movie details from server
async function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach(movie => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-search-list');
      movieSearchBox.value = "";
      const response = await fetch(`/movie/${movie.dataset.id}`);
      const movieDetails = await response.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${details.Poster !== "N/A" ? details.Poster : "image_not_found.png"}" alt="movie poster" data-id="${details.imdbID}">
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${details.Title}</h3>
      <ul class="movie-misc-info">
        <li class="year">Year: ${details.Year}</li>
        <li class="rated">Ratings: ${details.Rated}</li>
        <li class="released">Released: ${details.Released}</li>
      </ul>
      <p class="genre"><b>Genre:</b> ${details.Genre}</p>
      <p class="writer"><b>Writer:</b> ${details.Writer}</p>
      <p class="actors"><b>Actors: </b>${details.Actors}</p>
      <p class="plot"><b>Plot:</b> ${details.Plot}</p>
      <p class="language"><b>Language:</b> ${details.Language}</p>
      <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
      <button class="add-to-favorites" onclick="addToFavorites('${details.Title}')">Add to Favorites</button>
    </div>
  `;
}

let favoriteMovies = [];

function addToFavorites(movieTitle) {
  favoriteMovies.push(movieTitle);
  displayFavoriteMovies();
}

function displayFavoriteMovies() {
  favoriteMoviesList.innerHTML = "";
  favoriteMovies.forEach(movie => {
    const li = document.createElement('li');
    li.textContent = movie;
    favoriteMoviesList.appendChild(li);
  });
}

window.addEventListener('click', (event) => {
  if (event.target.className !== "form-control") {
    searchList.classList.add('hide-search-list');
  }
});