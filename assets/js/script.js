var apiKey = "9603226b4f0f0b966d316dd82eb976cd";
const inputEl = document.getElementById("city-input");
const searchEl = document.getElementById("search-button");
const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("city-name");
const currentPicEl = document.getElementById("current-pic");
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const currentUVEl = document.getElementById("UV-index");
const historyEl = document.getElementById("history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function getWeatherData(city) {
  let apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;
  axios.get(apiUrl).then(function (response) {
    console.log(response.data);
  });

}

// getWeatherData(city);
searchEl.addEventListener("click", function(){
      const searchCity= inputEl.value
      getWeatherData(searchCity);
      searchHistory.push(searchCity)
      localStorage.setItem("search", JSON.stringify(searchHistory))
})

clearEl.addEventListener("click", function(){
      searchHistory= []

      })