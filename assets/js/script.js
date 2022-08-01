var apiKey = "9603226b4f0f0b966d316dd82eb976cd";
const input = document.getElementById("city-input");
const searchBtn = document.getElementById("search-button");
const clearBtn = document.getElementById("clear-history");
const cityName = document.getElementById("city-name");
const currentWeatherImg = document.getElementById("current-pic");
const currentTemp = document.getElementById("temperature");
const currentHumidity = document.getElementById("humidity");
const currentWind = document.getElementById("wind-speed");
const currentUV = document.getElementById("UV-index");
const historyList = document.getElementById("history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function getWeatherData(city) {
  let apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;
  axios.get(apiUrl).then(function (response) {
    console.log(response.data);
    const dateOf = new Date(response.data.dt * 1000);
    console.log(dateOf);
    const day = dateOf.getDate();
    const month = dateOf.getMonth() + 1;
    const year = dateOf.getFullYear();
    cityName.innerHTML = month + "/" + day + "/" + year;
    let tempIcon = response.data.weather[0].icon;
    currentWeatherImg.setAttribute(
      "src",
      "https://openweathermap.org/img/wn/" + tempIcon + "@2x.png"
    );
    currentWeatherImg.setAttribute("alt", response.data.weather[0].description);
    currentTemp.innerHTML =
      "Temperature: " + k2f(response.data.main.temp) + "&#176F";
    currentHumidity.innerHTML =
      "Humidity: " + response.data.main.humidity + "%";
    currentWind.innerHTML = "Wind Speed: " + response.data.wind.speed + "mph";
    let lat = response.data.coord.lat;
    let lon = response.data.coord.lon;
    let UVQueryURL =
      "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey +
      "&cnt=1";
    axios.get(UVQueryURL).then(function (response) {
      let UVIndex = document.createElement("span");
      UVIndex.setAttribute("class", "badge badge-danger");
      UVIndex.innerHTML = response.data[0].value;
      currentUV.innerHTML = "UV Index: ";
      currentUV.append(UVIndex);
    });
    let cityID = response.data.id;
    let forecastQueryURL =
      "https://api.openweathermap.org/data/2.5/forecast?id=" +
      cityID +
      "&appid=" +
      apiKey;
    axios.get(forecastQueryURL).then(function (response) {
      //  Parse response to display forecast for next 5 days underneath current conditions
      const forecastEls = document.querySelectorAll(".forecast");
      for (i = 0; i < forecastEls.length; i++) {
        forecastEls[i].innerHTML = "";
        const forecastIndex = i * 8 + 4;
        const forecastDate = new Date(
          response.data.list[forecastIndex].dt * 1000
        );
        const forecastDay = forecastDate.getDate();
        const forecastMonth = forecastDate.getMonth() + 1;
        const forecastYear = forecastDate.getFullYear();
        const forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
        forecastDateEl.innerHTML =
          forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEls[i].append(forecastDateEl);
        const forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" +
            response.data.list[forecastIndex].weather[0].icon +
            "@2x.png"
        );
        forecastWeatherEl.setAttribute(
          "alt",
          response.data.list[forecastIndex].weather[0].description
        );
        forecastEls[i].append(forecastWeatherEl);
        // Forecast Temp
        const forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML =
          "Temp: " +
          k2f(response.data.list[forecastIndex].main.temp) +
          "&#176F";
        forecastEls[i].append(forecastTempEl);
        // Forecast Wind
        const forecastWindEl = document.createElement("p");
        forecastWindEl.innerHTML =
          "Wind: " + response.data.list[forecastIndex].wind.speed + "MPH";
        forecastEls[i].append(forecastWindEl);
        // Forecast Humidity
        const forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML =
          "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
        forecastEls[i].append(forecastHumidityEl);
      }
    });
  });
}
function k2f(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}

function renderSearchHistory() {
  historyList.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("input");
      // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("style", "margin-bottom: 10px;")
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-grey");
      historyItem.setAttribute("value", searchHistory[i]);
      historyItem.addEventListener("click", function() {
          getWeather(historyItem.value);
      })
      historyList.append(historyItem);
  }
}

renderSearchHistory();
if (searchHistory.length > 0) {
  getWeatherData(searchHistory[searchHistory.length - 1]);
}
// getWeatherData(city);
searchBtn.addEventListener("click", function () {
  const searchCity = input.value;
  getWeatherData(searchCity);
  searchHistory.push(searchCity);
  localStorage.setItem("search", JSON.stringify(searchHistory));
});

clearBtn.addEventListener("click", function () {
  searchHistory = [];
  renderSearchHistory();
});
