// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
const API_KEY = '0b808bc618af13ed0111062d449fae62';
const BASE    = 'https://api.openweathermap.org';

// ─────────────────────────────────────────────
//  DOM ELEMENTS
// ─────────────────────────────────────────────
const searchInput  = document.getElementById('searchInput');
const searchBtn    = document.getElementById('searchBtn');
const locationBtn  = document.getElementById('locationBtn');
const errorMsg     = document.getElementById('errorMsg');
const loading      = document.getElementById('loading');
const content      = document.getElementById('content');
const emptyState   = document.getElementById('emptyState');

// ─────────────────────────────────────────────
//  WEATHER EMOJI MAP
// ─────────────────────────────────────────────
const weatherEmoji = {
  '01d': '☀️',  '01n': '🌙',
  '02d': '⛅',  '02n': '☁️',
  '03d': '☁️',  '03n': '☁️',
  '04d': '☁️',  '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️',  '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

// ─────────────────────────────────────────────
//  AQI CONFIG
// ─────────────────────────────────────────────
const aqiInfo = [
  { label: 'Good',      color: '#00e396', bg: 'rgba(0,227,150,0.2)',   pct: 10  },
  { label: 'Fair',      color: '#ffe234', bg: 'rgba(255,226,52,0.2)',  pct: 30  },
  { label: 'Moderate',  color: '#ff7e00', bg: 'rgba(255,126,0,0.2)',   pct: 55  },
  { label: 'Poor',      color: '#ff0000', bg: 'rgba(255,0,0,0.2)',     pct: 78  },
  { label: 'Very Poor', color: '#8b0000', bg: 'rgba(139,0,0,0.25)',    pct: 95  },
];

// ─────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────
let currentLat = null;
let currentLon = null;

// ─────────────────────────────────────────────
//  UI HELPERS
// ─────────────────────────────────────────────
function showLoading() {
  loading.style.display    = 'flex';
  content.style.display    = 'none';
  emptyState.style.display = 'none';
  errorMsg.style.display   = 'none';
}

function showContent() {
  loading.style.display    = 'none';
  content.style.display    = 'flex';
  emptyState.style.display = 'none';
  errorMsg.style.display   = 'none';
}

function showError(msg) {
  loading.style.display    = 'none';
  content.style.display    = 'none';
  emptyState.style.display = 'none';
  errorMsg.style.display   = 'block';
  errorMsg.textContent     = msg;
}

function showEmpty() {
  loading.style.display    = 'none';
  content.style.display    = 'none';
  emptyState.style.display = 'flex';
  errorMsg.style.display   = 'none';
}

// ─────────────────────────────────────────────
//  FETCH HELPERS
// ─────────────────────────────────────────────
async function fetchWeatherByCity(city) {
  const res = await fetch(`${BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error(getApiErrorMessage(res.status, `City "${city}" not found.`, 'Failed to fetch weather data.'));
  return res.json();
}

async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(`${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!res.ok) throw new Error(getApiErrorMessage(res.status, null, 'Failed to fetch weather data.'));
  return res.json();
}

async function fetchAQI(lat, lon) {
  const res = await fetch(`${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!res.ok) throw new Error(getApiErrorMessage(res.status, null, 'Failed to fetch AQI data.'));
  return res.json();
}

function getApiErrorMessage(status, notFoundMessage, fallbackMessage) {
  if (status === 401) return 'Invalid OpenWeatherMap API key. Check or replace API_KEY in app.js.';
  if (status === 404 && notFoundMessage) return notFoundMessage;
  return fallbackMessage;
}

// ─────────────────────────────────────────────
//  FORMAT HELPERS
// ─────────────────────────────────────────────
function formatTime(unixTimestamp, timezoneOffset) {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function mpsToKmh(mps) {
  return Math.round(mps * 3.6);
}

// ─────────────────────────────────────────────
//  RENDER WEATHER
// ─────────────────────────────────────────────
function renderWeather(data) {
  const icon = data.weather[0].icon;

  document.getElementById('cityName').textContent    = data.name;
  document.getElementById('country').textContent     = data.sys.country;
  document.getElementById('weatherIcon').textContent = weatherEmoji[icon] || '🌤️';
  document.getElementById('tempMain').textContent    = `${Math.round(data.main.temp)}°`;
  document.getElementById('feelsLike').textContent   = `Feels like ${Math.round(data.main.feels_like)}°C`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent    = `${data.main.humidity}%`;
  document.getElementById('wind').textContent        = `${mpsToKmh(data.wind.speed)} km/h`;
  document.getElementById('pressure').textContent    = `${data.main.pressure} hPa`;
  document.getElementById('visibility').textContent  = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById('sunrise').textContent     = formatTime(data.sys.sunrise, data.timezone);
  document.getElementById('sunset').textContent      = formatTime(data.sys.sunset, data.timezone);

  // Subtle card tint based on weather condition.
  const heroCard = document.getElementById('heroCard');
  const main     = data.weather[0].main.toLowerCase();
  const gradients = {
    clear:        'linear-gradient(135deg, rgba(231,199,125,0.12), rgba(255,255,255,0.02))',
    clouds:       'linear-gradient(135deg, rgba(160,170,176,0.12), rgba(255,255,255,0.02))',
    rain:         'linear-gradient(135deg, rgba(143,211,199,0.13), rgba(255,255,255,0.02))',
    drizzle:      'linear-gradient(135deg, rgba(143,211,199,0.11), rgba(255,255,255,0.02))',
    thunderstorm: 'linear-gradient(135deg, rgba(125,137,149,0.14), rgba(255,255,255,0.02))',
    snow:         'linear-gradient(135deg, rgba(230,238,240,0.10), rgba(255,255,255,0.02))',
    mist:         'linear-gradient(135deg, rgba(180,190,190,0.11), rgba(255,255,255,0.02))',
  };

  const grad = gradients[main] || gradients.clouds;
  heroCard.style.background = `${grad}, rgba(255,255,255,0.055)`;
}

// ─────────────────────────────────────────────
//  RENDER AQI
// ─────────────────────────────────────────────
function renderAQI(data) {
  const aqi        = data.list[0].main.aqi;   // 1-5 scale
  const components = data.list[0].components;
  const info       = aqiInfo[aqi - 1];

  // Badge
  const badge = document.getElementById('aqiBadge');
  badge.textContent        = info.label;
  badge.style.background   = info.bg;
  badge.style.color        = info.color;
  badge.style.border       = `1px solid ${info.color}`;

  // Bar marker position
  document.getElementById('aqiMarker').style.left = `${info.pct}%`;

  // Pollutants
  const pollutants = [
    { name: 'PM2.5', val: components.pm2_5,  unit: 'µg/m³' },
    { name: 'PM10',  val: components.pm10,   unit: 'µg/m³' },
    { name: 'NO₂',   val: components.no2,    unit: 'µg/m³' },
    { name: 'O₃',    val: components.o3,     unit: 'µg/m³' },
    { name: 'CO',    val: components.co,     unit: 'µg/m³' },
    { name: 'SO₂',   val: components.so2,    unit: 'µg/m³' },
  ];

  document.getElementById('aqiPollutants').innerHTML = pollutants
    .map(p => `
      <div class="pollutant-chip">
        <span class="pollutant-name">${p.name}</span>
        <span class="pollutant-val">${p.val.toFixed(1)} ${p.unit}</span>
      </div>
    `)
    .join('');
}

// ─────────────────────────────────────────────
//  MAIN LOAD FUNCTION
// ─────────────────────────────────────────────
async function loadWeather(lat, lon, cityQuery = null) {
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    showError('Please add your OpenWeatherMap API key in app.js.');
    return;
  }

  showLoading();

  try {
    let weatherData;

    if (cityQuery) {
      weatherData  = await fetchWeatherByCity(cityQuery);
      currentLat   = weatherData.coord.lat;
      currentLon   = weatherData.coord.lon;
    } else {
      weatherData  = await fetchWeatherByCoords(lat, lon);
      currentLat   = lat;
      currentLon   = lon;
    }

    const aqiData  = await fetchAQI(currentLat, currentLon);

    renderWeather(weatherData);
    renderAQI(aqiData);
    showContent();

  } catch (err) {
    showError(err.message);
  }
}

// ─────────────────────────────────────────────
//  EVENT LISTENERS
// ─────────────────────────────────────────────

// Search button click
searchBtn.addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (!city) return;
  loadWeather(null, null, city);
});

// Enter key in search input
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const city = searchInput.value.trim();
    if (!city) return;
    loadWeather(null, null, city);
  }
});

// Location button
locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }

  showLoading();

  navigator.geolocation.getCurrentPosition(
    (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
    ()    => showError('Location access denied. Please search by city name instead.')
  );
});

// ─────────────────────────────────────────────
//  INIT — load a default city on startup
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
  // Change this to any default city you like
  loadWeather(null, null, 'Hyderabad');
});
