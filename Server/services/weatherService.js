const axios = require('axios');

/**
 * Fetch 5-day weather forecast for a given city
 */
async function getWeatherForecast(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'YOUR_OPENWEATHER_API_KEY') {
    return getMockWeather(city);
  }

  try {
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
      },
    });

    if (response.data && response.data.list) {
      // Group forecast per day
      const dailyForecasts = response.data.list.filter((item, idx) => idx % 8 === 0).map((day) => ({
        date: day.dt_txt.split(' ')[0],
        tempC: Math.round(day.main.temp),
        tempMin: Math.round(day.main.temp_min),
        tempMax: Math.round(day.main.temp_max),
        condition: day.weather[0]?.main || 'Clear',
        description: day.weather[0]?.description || 'Clear sky',
        icon: `https://openweathermap.org/img/wn/${day.weather[0]?.icon}@2x.png`,
        humidity: day.main.humidity,
        windSpeedMs: day.wind.speed,
      }));

      return {
        city: response.data.city?.name || city,
        country: response.data.city?.country || 'IN',
        forecast: dailyForecasts,
      };
    }

    return getMockWeather(city);
  } catch (err) {
    console.warn('⚠️ OpenWeather API call failed, using fallback weather:', err.message);
    return getMockWeather(city);
  }
}

function getMockWeather(city) {
  return {
    city,
    country: 'IN',
    forecast: [
      { date: '2026-08-15', tempC: 28, condition: 'Sunny', description: 'Sunny & Pleasant', icon: '☀️' },
      { date: '2026-08-16', tempC: 26, condition: 'Clouds', description: 'Partly Cloudy', icon: '⛅' },
      { date: '2026-08-17', tempC: 27, condition: 'Clear', description: 'Clear blue skies', icon: '☀️' },
    ],
  };
}

module.exports = {
  getWeatherForecast,
};
