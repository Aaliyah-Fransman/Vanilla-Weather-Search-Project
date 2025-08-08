function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let formattedDay = days[day];
  return `${formattedDay} ${hours}:${minutes}`;
}

function updateBackground(weatherDescription) {
  const body = document.getElementById("weather-body");

  const backgrounds = {
    clear:
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/171/890/original/clear.gif?1754604363')",
    cloudy:
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/171/891/original/clouds.gif?1754604386')",
    rain: "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/171/893/original/rain.gif?1754604417')",
    snow: "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/171/894/original/snow.gif?1754604432')",
    thunderstorm:
      "url('https://s3.amazonaws.com/shecodesio-production/uploads/files/000/171/895/original/thunderstorm.gif?1754604447')",
  };

  const synonyms = {
    clear: ["clear", "sunny"],
    cloudy: ["cloudy", "overcast", "partly cloudy"],
    rain: ["rain", "drizzle", "showers", "light rain"],
    snow: ["snow", "flurries", "blizzard"],
    thunderstorm: ["thunderstorm", "storm", "lightning", "thunder"],
  };

  let matchedKey = Object.keys(synonyms).find((key) =>
    synonyms[key].some((term) =>
      weatherDescription.toLowerCase().includes(term)
    )
  );

  const background = backgrounds[matchedKey] || backgrounds.clear;
  body.style.background = `${background} no-repeat center center / cover`;
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let temperature = Math.round(response.data.temperature.current);
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = temperature;
  timeElement.innerHTML = formatDate(date);
  iconElement.innerHTML = `
    <img src="${response.data.condition.icon_url}" class="current-temperature-icon" />
  `;

  updateBackground(response.data.condition.description.toLowerCase());
  getForecast(response.data.city);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHtml = "";

  response.data.daily.slice(0, 5).forEach(function (day) {
    let date = new Date(day.time * 1000);
    let dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    forecastHtml += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <div class="weather-forecast-icon">
          <img src="${day.condition.icon_url}" alt="${
      day.condition.description
    }" />
        </div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}°</strong>
          </div>
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.minimum)}°</strong>
          </div>
        </div>
      </div>`;
  });

  forecastElement.innerHTML = forecastHtml;
}

function getForecast(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  let city = searchInputElement.value;

  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

function loadDefaultCity() {
  const defaultCity = "Paris";
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${defaultCity}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

loadDefaultCity();
