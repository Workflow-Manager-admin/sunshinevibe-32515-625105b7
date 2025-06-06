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

/**
 * Predefined (hardcoded) mappings for (mood, weather) combinations,
 * for motivational quotes and outfit suggestions.
 */
const MOOD_WEATHER_COMBOS = {
  happy: {
    Clear: {
      quote: "Let the sunshine match your smile today!",
      outfit: "Sunglasses, bright tee, and comfy shorts"
    },
    Rain: {
      quote: "Keep dancing—rain can’t dampen your spirit!",
      outfit: "Cheery raincoat and waterproof boots"
    },
    Clouds: {
      quote: "Even on cloudy days, happiness shines through.",
      outfit: "Fun sweater and light scarf"
    },
    Snow: {
      quote: "Snow brings sparkle—just like your mood!",
      outfit: "Cozy beanie, parka, and mittens"
    },
    Default: {
      quote: "Shine bright, whatever the weather!",
      outfit: "Your favorite outfit"
    }
  },
  sad: {
    Clear: {
      quote: "Blue skies bring hope. Brighter days ahead.",
      outfit: "Soft hoodie and light jeans"
    },
    Rain: {
      quote: "Let the rain wash your worries away.",
      outfit: "Warm jumper and rain boots"
    },
    Clouds: {
      quote: "Clouds pass by—so do tough times.",
      outfit: "Comfort clothes and big scarf"
    },
    Snow: {
      quote: "A fresh start, like untouched snow.",
      outfit: "Fluffy jacket and knitted hat"
    },
    Default: {
      quote: "It’s okay to feel blue. Treat yourself with kindness.",
      outfit: "Whatever feels coziest"
    }
  },
  tired: {
    Clear: {
      quote: "Catch some rays, recharge your energy.",
      outfit: "Relaxed joggers and tee"
    },
    Rain: {
      quote: "Perfect weather for a nap and hot drink.",
      outfit: "Comfy hoodie and PJs"
    },
    Clouds: {
      quote: "Rest up, soon the sun will shine again.",
      outfit: "Stretchy pants and sweater"
    },
    Snow: {
      quote: "Snuggle weather! Time to unwind.",
      outfit: "Fuzzy socks, thick jumper, blanket"
    },
    Default: {
      quote: "Rest is productive too.",
      outfit: "Whatever helps you relax"
    }
  },
  anxious: {
    Clear: {
      quote: "Take a deep breath—clear skies ahead.",
      outfit: "Soft shirt, loose pants, comfy shoes"
    },
    Rain: {
      quote: "Listen to the rain and let stress drift away.",
      outfit: "Layered sweater and comfy jeans"
    },
    Clouds: {
      quote: "Clouds are temporary; calm is coming.",
      outfit: "Casual dress and cardigan"
    },
    Snow: {
      quote: "Let the snowfall bring you peace.",
      outfit: "Warm parka and soft mitts"
    },
    Default: {
      quote: "You’ve weathered storms before—you’ll get through this too.",
      outfit: "Whatever makes you feel safe"
    }
  },
  excited: {
    Clear: {
      quote: "It’s a perfect day to make awesome memories!",
      outfit: "Trendy shades and bright clothes"
    },
    Rain: {
      quote: "Rain just adds drama to your adventures!",
      outfit: "Colorful jacket and cool boots"
    },
    Clouds: {
      quote: "Clouds can’t dim your sparkle.",
      outfit: "Flashy tee and fun necklace"
    },
    Snow: {
      quote: "Let’s play! Snow can’t slow you down.",
      outfit: "Sporty coat and warm hat"
    },
    Default: {
      quote: "Today will be epic—own it!",
      outfit: "Your boldest outfit"
    }
  }
};

/**
 * Map weather "main" condition to a background image.
 * Use local assets/URLs if provided, else public domain image URLs as placeholders.
 */
const WEATHER_BACKGROUND_IMAGES = {
  Clear: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80', // Sunny
  Clouds: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1000&q=80', // Cloudy
  Rain: 'https://images.unsplash.com/photo-1465101178521-c1a9136a06b9?auto=format&fit=crop&w=1000&q=80', // Rainy
  Snow: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80', // Snowy
  Default: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1000&q=80'
};

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
      // Extract temperature and weather condition for UI display
      const temperature = data?.main?.temp;
      const weatherCondition = data?.weather?.[0]?.main;
      setWeather({
        name: data.name,
        country: data.sys.country,
        temp: temperature !== undefined ? Math.round(temperature) : 'N/A',
        feels_like: data?.main?.feels_like !== undefined ? Math.round(data.main.feels_like) : 'N/A',
        description: data?.weather?.[0]?.description || '',
        main: weatherCondition || ''
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

  /**
   * Returns motivational quote and outfit suggestion given mood and weather main condition.
   */
  function getQuoteAndOutfit(mood, weatherMain) {
    if (!mood) return { quote: '', outfit: '' };
    const mapping = MOOD_WEATHER_COMBOS[mood] || {};
    // Default to 'Default' if the main weather doesn't exist in mapping
    const entry = mapping[weatherMain] || mapping.Default || { quote: '', outfit: '' };
    return entry;
  }

  /**
   * Returns the background image URL for the given weather main.
   */
  function getWeatherBackgroundImage(weatherMain) {
    if (!weatherMain) return WEATHER_BACKGROUND_IMAGES.Default;
    return WEATHER_BACKGROUND_IMAGES[weatherMain] || WEATHER_BACKGROUND_IMAGES.Default;
  }

  // Main App rendering
  // Pick background image if weather is known, else default gradient as before.
  const bgImageUrl =
    weather && weather.main ? getWeatherBackgroundImage(weather.main) : null;

  // If weather + mood, get the motivational quote and outfit.
  const { quote: comboQuote, outfit: outfitSuggestion } =
    weather && mood
      ? getQuoteAndOutfit(mood, weather.main)
      : { quote: '', outfit: '' };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bgImageUrl
          ? `linear-gradient(rgba(255,255,255,0.81), rgba(0,0,0,0.23)), url(${bgImageUrl}) center/cover no-repeat`
          : `linear-gradient(120deg, ${COLORS.secondary} 60%, ${COLORS.primary} 100%)`,
        transition: 'background-image 0.75s cubic-bezier(0.4,0,0.2,1)'
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
            background: 'rgba(255,255,255,0.87)',
            borderRadius: 16,
            boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
            border: `3px solid ${MOOD_ACCENTS[mood] || COLORS.accent}`,
            position: 'relative',
            padding: '32px 26px 24px 26px',
            textAlign: 'center',
            zIndex: 2,
            backdropFilter: bgImageUrl ? 'blur(1px)' : 'none'
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

          {/* NEW: Motivational Quote for combo */}
          {comboQuote && (
            <div style={{
              fontSize: 18,
              color: COLORS.primary,
              fontWeight: 600,
              margin: '22px 0 10px 0',
              letterSpacing: '0.2px'
            }}>
              {/* Typography for motivational quote */}
              <span role="img" aria-label="sparkle">💡</span> <em>{comboQuote}</em>
            </div>
          )}

          {/* NEW: Outfit suggestion */}
          {outfitSuggestion && (
            <div style={{
              fontSize: 16.3,
              color: '#3b8499',
              marginBottom: 6,
              marginTop: 6,
              fontWeight: 500,
            }}>
              <span role="img" aria-label="outfit">👕</span> Outfit Suggestion: <span style={{ fontWeight: 600 }}>{outfitSuggestion}</span>
            </div>
          )}

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
