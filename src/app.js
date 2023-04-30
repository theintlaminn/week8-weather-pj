// Show current day
function showCurrentDate() {
    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Suturday',
    ];

    let now = new Date();
    let day = days[now.getDay()];
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    let dayAndTime = `${day} ${hours}:${minutes}`;
    return dayAndTime;
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}

let currentDay = document.querySelector('#current-day');
currentDay.innerHTML = showCurrentDate();

function displayForecast(response) {
    let forecast = response.data.daily;

    let forecastElement = document.querySelector('#forecast');

    let forecastHTML = `<div class="row">`;
    forecast.forEach(function(forecastDay, index) {
        if (index < 6) {
            forecastHTML =
                forecastHTML +
                `
     <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
      <img
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        width="42"
      />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max"> ${Math.round(forecastDay.temp.max)}° </span>
        <span class="weather-forecast-temperature-min"> ${Math.round(forecastDay.temp.min)}° </span>
      </div>
    </div>
      `;
        }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}


function getForecast(coordinates) {
    let apiKey = "2ff29bed3181c3526c35cc5408037f85";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}


function showTemperature(response) {
    document.querySelector('#current-location').innerHTML = response.data.name;

    celciusTemperature = response.data.main.temp;

    document.querySelector('#temperature').innerHTML = Math.round(
        celciusTemperature
    );

    document.querySelector('#description').innerHTML =
        response.data.weather[0].main;
    document.querySelector('#humidity').innerHTML = response.data.main.humidity;
    document.querySelector('#wind').innerHTML = Math.round(
        response.data.wind.speed * 3.6
    );
    document
        .querySelector('#icon')
        .setAttribute(
            'src',
            `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        );
    document
        .querySelector('#icon')
        .setAttribute('alt', response.data.weather[0].description);

    getForecast(response.data.coord);
}

function searchCity(city) {
    let key = '866a208a73eeff02182218e9441647a1';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    axios.get(url).then(showTemperature);
}

function showCity(event) {
    event.preventDefault();
    let city = document.querySelector('.search-input').value;
    searchCity(city);
}

let searchForm = document.querySelector('#searchForm');
searchForm.addEventListener('submit', showCity);

// Fahrentheight
function convertToFahrenheit(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector('#temperature');
    celsiusLink.classList.remove('active');
    fahrenheitLink.classList.add('active');
    let fahrentheightTemperature = (celciusTemperature * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrentheightTemperature);
}

// Celcius
function convertToCelsius(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector('#temperature');
    fahrenheitLink.classList.remove('active');
    celsiusLink.classList.add('active');
    temperatureElement.innerHTML = Math.round(celciusTemperature);
}

let celciusTemperature = null;

let fahrenheitLink = document.querySelector('#fahrenheit-link');
fahrenheitLink.addEventListener('click', convertToFahrenheit);

let celsiusLink = document.querySelector('#celsius-link');
celsiusLink.addEventListener('click', convertToCelsius);

searchCity('Yangon');
displayForecast();