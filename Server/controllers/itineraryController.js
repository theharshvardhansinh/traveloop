const { generateItineraryWithGemini } = require('../services/geminiService');
const { searchPlaces, searchHotels } = require('../services/placesService');
const { getWeatherForecast } = require('../services/weatherService');

/**
 * @desc Generate full AI itinerary using Gemini
 * @route POST /api/itinerary/generate
 */
async function generateItinerary(req, res, next) {
  try {
    const { startLocation, destination, travelMode, groupType, tripTheme, startDate, endDate, themeSliders } = req.body;

    if (!startLocation || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Start Location and Destination',
      });
    }

    console.log(`🤖 Generating Gemini AI Itinerary for ${startLocation} ➔ ${destination}`);
    const itinerary = await generateItineraryWithGemini({
      startLocation,
      destination,
      travelMode,
      groupType,
      tripTheme,
      startDate,
      endDate,
      themeSliders,
    });

    // Optionally fetch weather forecast for destination
    let weather = null;
    try {
      weather = await getWeatherForecast(destination);
    } catch (wErr) {
      console.warn('Could not fetch weather:', wErr.message);
    }

    return res.json({
      success: true,
      itinerary,
      weather,
    });
  } catch (error) {
    console.error('❌ Itinerary Generation Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI itinerary',
    });
  }
}

/**
 * @desc Search Places / Attractions
 * @route GET /api/places/search
 */
async function searchPlacesHandler(req, res) {
  try {
    const { query, location } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }
    const places = await searchPlaces(query, location);
    return res.json({ success: true, count: places.length, places });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * @desc Search Hotels
 * @route GET /api/places/hotels
 */
async function searchHotelsHandler(req, res) {
  try {
    const { city, category } = req.query;
    if (!city) {
      return res.status(400).json({ success: false, message: 'City parameter is required' });
    }
    const hotels = await searchHotels(city, category);
    return res.json({ success: true, count: hotels.length, hotels });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * @desc API Services Status Health Check
 * @route GET /api/services/status
 */
function getServicesStatus(_req, res) {
  res.json({
    success: true,
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      googlePlaces: !!process.env.GOOGLE_MAPS_API_KEY,
      openWeather: !!process.env.OPENWEATHER_API_KEY,
      aviationStack: !!process.env.AVIATIONSTACK_API_KEY,
    },
  });
}

module.exports = {
  generateItinerary,
  searchPlacesHandler,
  searchHotelsHandler,
  getServicesStatus,
};
