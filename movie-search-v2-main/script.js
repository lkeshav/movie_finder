const apiKey = "YOUR_OMDB_API_KEY"; // keep your existing key
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const themeToggle = document.getElementById("themeToggle");
const movieContainer = document.getElementById("movieContainer");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

// Fetch movies
async function fetchMovies(query) {
  movieContainer.innerHTML = "";
  const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
  const data = await res.json();
  if (data.Search) {
    for (const movie of data.Search) {
      const details = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`).then(r => r.json());
      createMovieCard(details);
    }
  } else {
    movieContainer.innerHTML = `<p>No results found</p>`;
  }
}

// Create movie card
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/220x330"}" alt="${movie.Title}">
      </div>
      <div class="card-back">
        <h3>${movie.Title} (${movie.Year})</h3>
        <p><b>Genre:</b> ${movie.Genre || "N/A"}</p>
        <p><b>Runtime:</b> ${movie.Runtime || "N/A"}</p>
        <p><b>Rating:</b> ${movie.imdbRating || "N/A"}</p>
        <button class="watchlist-btn">⭐ Watchlist</button>
        <button class="trailer-btn">▶ Trailer</button>
      </div>
    </div>
  `;

  // Watchlist button
  card.querySelector(".watchlist-btn").addEventListener("click", () => {
    if (!watchlist.includes(movie.imdbID)) {
      watchlist.push(movie.imdbID);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      alert(`${movie.Title} added to watchlist!`);
    } else {
      alert("Already in watchlist!");
    }
  });

  // Trailer button
  card.querySelector(".trailer-btn").addEventListener("click", () => {
    const query = encodeURIComponent(`${movie.Title} trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  });

  movieContainer.appendChild(card);
}

// Random movie
async function fetchRandomMovie() {
  const randomTitles = ["Inception", "Titanic", "Avengers", "Batman", "Matrix", "Interstellar"];
  const query = randomTitles[Math.floor(Math.random() * randomTitles.length)];
  fetchMovies(query);
}

// Theme toggle
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  });
}

// Events
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
  });
}

if (randomBtn) {
  randomBtn.addEventListener("click", fetchRandomMovie);
}

// Landing → random flag check
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("random") === "true") {
    fetchRandomMovie();
  }
});
