# Weatherly 🌤️

A colorful weather dashboard showing real-time weather conditions and air quality index (AQI) for any city — built with vanilla HTML, CSS and JavaScript.

## Features

- 🌡️ Current temperature, feels like, weather description
- 💧 Humidity, wind speed, pressure, visibility
- 🌅 Sunrise & sunset times
- 🌫️ Air Quality Index (AQI) with visual bar and pollutant breakdown (PM2.5, PM10, NO₂, O₃, CO, SO₂)
- 📍 Auto-detect location via browser
- 🎨 Dynamic card background that changes based on weather condition
- Fully responsive

## Tech Stack

- **HTML5** — structure
- **CSS3** — styling (glassmorphism, animated blobs, gradients)
- **JavaScript (Vanilla)** — logic and API calls
- **OpenWeatherMap API** — weather + AQI data

## Getting Started

### 1. Get a free API key

1. Go to [openweathermap.org](https://openweathermap.org)
2. Sign up for a free account
3. Go to **My API Keys** and copy your key
4. Note: free tier keys take ~10 minutes to activate after signup

### 2. Add your API key

Open `js/app.js` and replace line 7:

```js
const API_KEY = 'YOUR_API_KEY_HERE';
```

with your actual key:

```js
const API_KEY = 'abc123yourkeyhere';
```

### 3. Open the app

Just open `index.html` in your browser — no build step, no server needed.

---

## Project Structure

```
weather-app/
├── index.html       # App structure and layout
├── css/
│   └── style.css    # All styles — blobs, cards, AQI bar, responsive
├── js/
│   └── app.js       # API calls, DOM updates, event listeners
└── README.md
```

## API Used

- `GET /data/2.5/weather` — current weather by city or coordinates
- `GET /data/2.5/air_pollution` — AQI and pollutant data by coordinates

Both are free on OpenWeatherMap's free tier (60 calls/minute).

## Deployment

Since this is a pure frontend project (no server), you can deploy it anywhere:

- **GitHub Pages** — upload the folder to a repo, enable Pages in settings
- **Netlify** — drag and drop the folder at netlify.com/drop
- **Vercel** — connect the repo and deploy with zero config
