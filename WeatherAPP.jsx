import React, { useEffect, useState } from "react";
import "./style.css";

export default function WeatherApp() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [weather, setWeather] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  
  const CITY_LIST = [
    "Delhi, India",
    "Mumbai, India",
    "Kolkata, India",
    "Bengaluru, India",
    "Chennai, India",
    "London, UK",
    "New York, USA",
    "Sydney, AU",
  ];

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = CITY_LIST.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
    setSuggestions(filtered);
    setSelectedIndex(-1);
  }, [query]);

  
  async function fetchWeatherByCity(city) {

    const data = {
      tempC: 28,
      feelsLike: 30,
      condition: "Partly Cloudy",
      icon: "https://openweathermap.org/img/wn/03d@2x.png",
      wind: 14,
      humidity: 68,
      localTime: new Date().toLocaleString(),
      cityName: city,
    };
    // -------------------------------

    setWeather(data);
    setShowPanel(true);
  }

  async function fetchWeatherByCoords(lat, lon) {
 
    const data = {
      tempC: 25,
      feelsLike: 26,
      condition: "Sunny",
      icon: "https://openweathermap.org/img/wn/01d@2x.png",
      wind: 10,
      humidity: 55,
      localTime: new Date().toLocaleString(),
      cityName: `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`,
    };
    setWeather(data);
    setShowPanel(true);
  }

  function handleInputChange(e) {
    setQuery(e.target.value);
  }

  function handleKeyDown(e) {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const val = selectedIndex >= 0 ? suggestions[selectedIndex] : query;
      if (val) selectCity(val);
    }
  }

  function selectCity(city) {
    setQuery(city);
    setSuggestions([]);
    fetchWeatherByCity(city);
  }

  function handleSuggestionClick(city) {
    selectCity(city);
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        alert("Could not get your location. Please allow location access or try again.");
        console.error(err);
      }
    );
  }

  return (
    <main className="page">
      <section className="bg-layer" id="bgLayer" />

      <div className="glass-card" role="main" aria-labelledby="appTitle">
        <header className="card-head">
          <h1 id="appTitle">🌤️ Weather Forecast</h1>
          <p className="subtitle">Get instant, real-time weather updates</p>
        </header>

        {/* Search */}
        <div className="search-block">
          <label htmlFor="cityInput" className="visually-hidden">
            🔍Search city
          </label>
          <input
            id="cityInput"
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            placeholder="Search any city (e.g., Delhi)"
          />

          {suggestions.length > 0 && (
            <ul id="suggestions" className="suggestions" role="listbox" aria-label="City suggestions">
              {suggestions.map((s, idx) => (
                <li
                  key={s}
                  role="option"
                  aria-selected={selectedIndex === idx}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Weather Panel */}
        <section id="weatherPanel" className={`weather-panel ${showPanel ? "" : "hidden"}`} aria-live="polite">
          <div className="weather-left">
            <img id="weatherIcon" className="weather-icon" src={weather ? weather.icon : ""} alt={weather ? weather.condition : "Weather icon"} />
            <div className="temp-block">
              <span id="tempC" className="temp">{weather ? `${weather.tempC}°C` : "--°C"}</span>
              <span id="conditionText" className="condition">{weather ? weather.condition : "--"}</span>
            </div>
          </div>

          <div className="weather-right">
            <div className="meta">
              <div>
                <strong>City</strong>
                <div id="cityName">{weather ? weather.cityName : "—"}</div>
              </div>

              <div>
                <strong>Feels like</strong>
                <div id="feelsLike">{weather ? `${weather.feelsLike}°C` : "—°C"}</div>
              </div>

              <div>
                <strong>Wind</strong>
                <div id="wind">{weather ? `${weather.wind} kph` : "— kph"}</div>
              </div>

              <div>
                <strong>Humidity</strong>
                <div id="humidity">{weather ? `${weather.humidity}%` : "—%"}</div>
              </div>

              <div>
                <strong>Local time</strong>
                <div id="localTime">{weather ? weather.localTime : "—"}</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="card-foot">
          <small>Made with ❤️ by Shubham Goel</small>
          <button id="useLocationBtn" className="btn subtle" onClick={handleUseLocation}>
            📍 Use My Location
          </button>
        </footer>
      </div>
    </main>
  );
}
