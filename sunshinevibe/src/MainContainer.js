import React, { useState } from 'react';

// UI colors according to requirements
const COLORS = {
  primary: '#4A90E2',
  secondary: '#F5F7FA',
  accent: '#FFD700'
};

// Map moods to accent icons/emoji and background tweaks
const MOOD_OPTIONS = [
  { value: '', label: 'Select a mood' },
  { value: 'happy', label: 'Happy', icon: '😄' },
  { value: 'sad', label: 'Sad', icon: '😢' },
  { value: 'tired', label: 'Tired', icon: '😴' },
  { value: 'anxious', label: 'Anxious', icon: '😬' },
  { value: 'excited', label: 'Excited', icon: '🤩' }
];

// Simple mood palette for feedback card
const MOOD_ACCENTS = {
  happy: COLORS.accent,
  sad: '#90a1c6',
  tired: '#bdbdbd',
  anxious: '#ffb347',
  excited: '#ff85a2'
};

// Utility to map OpenWeatherMap weather to emoji
function getWeatherIcon(condition) {
  if (!condition) return '🌈';
  const c = condition.toLowerCase();
  if (c.includes('cloud')) return '☁️';
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
  if (c.includes('clear')) return '☀️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('storm') || c.includes('thunder')) return '⛈️';
  if (c.includes('mist') || c.includes('fog')) return '🌫️';
  return '🌈';
}

// PUBLIC_INTERFACE
function MainContainer() {
  /**
   * Uplifting main container for SunshineVibe.
   * - City input, mood selection, fetch weather, visually engaging card & mood accent.
   */
  const [city, setCity] = useState('');
  const [mood, setMood] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve OpenWeatherMap API key from environment variable only (do not fallback to a placeholder).
  const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

  // Handles city change
  function onCityInput(e) {
    setCity(e.target.value);
  }

  // Handles mood change
  function onMoodChange(e) {
    setMood(e.target.value);
  }

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setWeather(null);
    setError('');
    if (!city) {
      setError('Please enter a city');
      return;
    }
    if (!mood) {
      setError('Please select a mood');
      return;
    }
    if (!OPENWEATHER_API_KEY) {
      setError('API key for OpenWeatherMap not found. Please contact the administrator to set REACT_APP_OPENWEATHERMAP_API_KEY in your environment.');
      return;
    }
    setLoading(true);

    // Weather fetch
    try {
      const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const resp = await fetch(url);
      if (!resp.ok) {
        setError('City not found. Try another city!');
        setLoading(false);
        return;
      }
      const data = await resp.json();
      setWeather({
        name: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        main: data.weather[0].main
      });
    } catch (e) {
      setError('Error fetching weather. Please try again later.');
    }
    setLoading(false);
  }

  // Find mood label/icon
  function getMoodOption(v) {
    return MOOD_OPTIONS.find((opt) => opt.value === v) || {};
  }

  // Uplifting feedback text per mood
  function getUpliftingMessage(mood) {
    switch (mood) {
      case 'happy':
        return "Keep shining! Spread your joy to the world ✨";
      case 'sad':
        return "Even cloudy days pass. Sending you sunshine! ☀️";
      case 'tired':
        return "Rest up! The world will wait for your energy 🌱";
      case 'anxious':
        return "Breathe deep. Blue skies are ahead 💙";
      case 'excited':
        return "Your excitement is contagious! Let's make today amazing! 🚀";
      default:
        return '';
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(120deg, ${COLORS.secondary} 60%, ${COLORS.primary} 100%)`
      }}
    >
      {/* App Title */}
      <header style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 16 }}>
        <h1 style={{
          fontSize: 44,
          color: COLORS.primary,
          fontWeight: 700,
          margin: 0,
          letterSpacing: '1.5px'
        }}>
          SunshineVibe <span role="img" aria-label="sun">☀️</span>
        </h1>
        <p style={{ color: '#888', fontWeight: 500, marginBottom: 0, marginTop: 12 }}>
          Weather & Mood Booster
        </p>
      </header>

      {/* Main Input Card */}
      <div style={{
        maxWidth: 380,
        margin: '0 auto',
        marginTop: 32,
        padding: 32,
        borderRadius: 18,
        background: '#fff',
        boxShadow: '0 8px 32px rgba(74,144,226,0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        border: `2.5px solid ${COLORS.primary}20`
      }}>
        <form onSubmit={handleSubmit}>
          {/* City input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <label htmlFor="city" style={{ fontWeight: 600, color: COLORS.primary }}>
              Which city are you in?
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={onCityInput}
              placeholder="Enter city"
              style={{
                padding: '10px 12px',
                fontSize: 16,
                border: `1.5px solid ${COLORS.primary}33`,
                borderRadius: 6,
                outline: 'none',
                marginBottom: 6
              }}
            />
          </div>

          {/* Mood dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <label htmlFor="mood" style={{ fontWeight: 600, color: COLORS.primary }}>
              How are you feeling?
            </label>
            <select
              id="mood"
              value={mood}
              onChange={onMoodChange}
              style={{
                padding: '10px 12px',
                fontSize: 16,
                border: `1.5px solid ${COLORS.primary}33`,
                borderRadius: 6,
                outline: 'none'
              }}
            >
              {MOOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} {opt.icon ? opt.icon : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: COLORS.primary,
              color: '#fff',
              fontWeight: 600,
              padding: '12px 0',
              borderRadius: 8,
              fontSize: 17,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '1px',
              marginTop: 6
            }}
            disabled={loading}
          >
            {loading ? 'Fetching weather...' : 'Show my Sunshine Vibe'}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div style={{ padding: 10, color: '#c80000', fontWeight: 500 }}>
            {error}
          </div>
        )}
      </div>

      {/* Weather & Uplifted Mood Card */}
      {weather && !error && (
        <div
          style={{
            maxWidth: 420,
            margin: '38px auto auto',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
            border: `3px solid ${MOOD_ACCENTS[mood] || COLORS.accent}`,
            position: 'relative',
            padding: '32px 26px 24px 26px',
            textAlign: 'center',
            zIndex: 2
          }}
        >
          {/* Mood icon */}
          <div style={{
            position: 'absolute',
            top: -24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: MOOD_ACCENTS[mood] || COLORS.accent,
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
            fontSize: 25,
            color: '#fff',
            border: '3px solid #fff'
          }}>
            {getMoodOption(mood)?.icon}
          </div>
          {/* Weather Info */}
          <h2 style={{
            margin: 0,
            fontSize: 22,
            color: COLORS.primary,
            fontWeight: 600,
            marginTop: 18
          }}>
            {weather.name}, {weather.country}
          </h2>
          <div style={{ fontSize: 18, marginTop: 6, color: '#888', textTransform: 'capitalize' }}>
            <span style={{ fontSize: 25, marginRight: 7 }}>
              {getWeatherIcon(weather.main)}
            </span>
            {weather.description}
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, margin: '12px 0', color: MOOD_ACCENTS[mood] || COLORS.primary }}>
            {weather.temp}°C
            <span style={{ fontSize: 16, fontWeight: 400, color: '#888', marginLeft: 7 }}>
              (feels like {weather.feels_like}°C)
            </span>
          </div>
          <div style={{
            fontSize: 17,
            color: MOOD_ACCENTS[mood] || COLORS.primary,
            fontWeight: 600,
            marginTop: 18
          }}>
            {getUpliftingMessage(mood)}
          </div>
        </div>
      )}

      <footer style={{
        marginTop: 56,
        textAlign: 'center',
        color: COLORS.primary,
        fontWeight: 400,
        fontSize: 15,
        paddingBottom: 24
      }}>
        Powered by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.primary, fontWeight: 600, textDecoration: 'none' }}>OpenWeatherMap</a>
      </footer>
    </div>
  );
}

export default MainContainer;
