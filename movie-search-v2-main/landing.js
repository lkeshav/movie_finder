
const apiKey = "c9348fa6"; 

const posters = [
  "https://image.tmdb.org/t/p/w1280/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
  "https://image.tmdb.org/t/p/w1280/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
  "https://image.tmdb.org/t/p/w1280/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg",
  "https://image.tmdb.org/t/p/w1280/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg"
];

let index = 0;
function changeBackground() {
  document.body.style.backgroundImage = `url(${posters[index]})`;
  index = (index + 1) % posters.length;
}
setInterval(changeBackground, 4000);
changeBackground();

document.getElementById("randomBtn").addEventListener("click", async () => {
  const keywords = ["batman", "avengers", "matrix", "spiderman", "ironman", "joker", "harry potter"];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${randomKeyword}`);
    const data = await res.json();

    if (data.Response === "True" && data.Search.length > 0) {
      const randomMovie = data.Search[Math.floor(Math.random() * data.Search.length)];
      
      window.location.href = `index.html?movie=${encodeURIComponent(randomMovie.Title)}`;
    } else {
      alert("No movie found, try again!");
    }
  } catch (err) {
    console.error(err);
    alert("Error fetching movie data.");
  }
});
