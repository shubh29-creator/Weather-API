const API_KEY = "300781ff67fac9fddac1248b3336c954";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";

const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");
const weatherPanel = document.getElementById("weatherPanel");
const weatherIcon = document.getElementById("weatherIcon");
const tempC = document.getElementById("tempC");
const conditionText = document.getElementById("conditionText");
const cityName = document.getElementById("cityName");
const feelsLike = document.getElementById("feelsLike");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const localTime = document.getElementById("localTime");
const currentDate = document.getElementById("currentDate");
const useLocationBtn = document.getElementById("useLocationBtn");
const bgLayer = document.getElementById("bgLayer");

async function fetchWeather(city) {
  try {
    const res = await fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    updateWeatherUI(data);
  } catch (err) {
    alert(err.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(`${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await res.json();
    updateWeatherUI(data);
  } catch (err) {
    alert("Unable to fetch weather for your location.");
  }
}

function updateWeatherUI(data) {
  const { name, main, weather, wind: windData, dt, timezone } = data;

  cityName.textContent = name;
  tempC.textContent = `${Math.round(main.temp)}°C`;
  conditionText.textContent = weather[0].description;
  feelsLike.textContent = `${Math.round(main.feels_like)}°C`;
  wind.textContent = `${windData.speed} kph`;
  humidity.textContent = `${main.humidity}%`;

  weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  weatherIcon.alt = weather[0].description;

  const local = new Date((dt + timezone) * 1000);
  localTime.textContent = local.toUTCString().slice(17, 22);

  const date = new Date((dt + timezone) * 1000);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.textContent = date.toUTCString().slice(0, 16); // e.g., "Sat, 07 Dec 2025"

  weatherPanel.classList.remove("hidden");

  if (weather[0].main.toLowerCase().includes("cloud")) {
    bgLayer.style.background = "linear-gradient(180deg, #3a3a3a, #1a1a1a)";
  } else if (weather[0].main.toLowerCase().includes("rain")) {
    bgLayer.style.background = "linear-gradient(180deg, #2c3e50, #4ca1af)";
  } else {
    bgLayer.style.background = "linear-gradient(180deg, #000014, #001f3f)";
  }
}

async function fetchCitySuggestions(query) {
  if (!query) return [];
  try {
    const res = await fetch(`${GEO_URL}?q=${query}&limit=5&appid=${API_KEY}`);
    const data = await res.json();
    return data.map(item => `${item.name}${item.state ? ", " + item.state : ""}, ${item.country}`);
  } catch {
    return [];
  }
}

async function updateSuggestions() {
  const query = cityInput.value.trim();
  const cities = await fetchCitySuggestions(query);
  
  suggestions.innerHTML = "";
  if (cities.length === 0) return;
  
  cities.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      cityInput.value = city;
      suggestions.innerHTML = "";
      fetchWeather(city);
    });
    suggestions.appendChild(li);
  });
}

cityInput.addEventListener("input", updateSuggestions);

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
      suggestions.innerHTML = "";
    }
  }
});

useLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    }, () => {
      alert("Unable to get your location.");
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
});
