const { generateItineraryWithGemini } = require('../services/geminiService');
const { searchPlaces, searchHotels } = require('../services/placesService');
const { getWeatherForecast } = require('../services/weatherService');
const { computeRoute } = require('../services/routesService');
const { searchFlights, searchTrains } = require('../services/transportService');
const { getExchangeRates, convertCurrency } = require('../services/currencyService');

/**
 * @desc Generate full AI itinerary using Gemini
 * @route POST /api/itinerary/generate
 */
async function generateItinerary(req, res) {
  try {
    const { startLocation, destination, travelMode, groupType, tripTheme, startDate, endDate, themeSliders } = req.body;

    if (!startLocation || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Start Location and Destination',
      });
    }

    console.log(`🤖 Generating Gemini AI Itinerary for ${startLocation} ➔ ${destination}`);

    // Run parallel fetches for AI Itinerary, Route details, Weather, Transport & Currency
    const [itinerary, routeDetails, weather] = await Promise.all([
      generateItineraryWithGemini({
        startLocation,
        destination,
        travelMode,
        groupType,
        tripTheme,
        startDate,
        endDate,
        themeSliders,
      }),
      computeRoute(startLocation, destination, [], travelMode),
      getWeatherForecast(destination).catch(() => null),
    ]);

    return res.json({
      success: true,
      itinerary,
      routeDetails,
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
 * @desc Compute Route Details
 * @route GET /api/itinerary/route
 */
async function getRouteHandler(req, res) {
  try {
    const { origin, destination, mode } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Origin and Destination required' });
    }
    const route = await computeRoute(origin, destination, [], mode);
    return res.json({ success: true, route });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * @desc Search Places / Attractions
 * @route GET /api/itinerary/places/search
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
 * @route GET /api/itinerary/places/hotels
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
 * @desc Flight Search
 * @route GET /api/itinerary/transport/flights
 */
async function searchFlightsHandler(req, res) {
  try {
    const { origin, destination, date } = req.query;
    const flights = await searchFlights(origin || 'Delhi', destination || 'Mumbai', date);
    return res.json({ success: true, count: flights.length, flights });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * @desc Train Search
 * @route GET /api/itinerary/transport/trains
 */
async function searchTrainsHandler(req, res) {
  try {
    const { origin, destination, date } = req.query;
    const trains = await searchTrains(origin || 'Delhi', destination || 'Mumbai', date);
    return res.json({ success: true, count: trains.length, trains });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * @desc Get Live Exchange Rates
 * @route GET /api/itinerary/currency/rates
 */
async function getCurrencyRatesHandler(req, res) {
  try {
    const { base } = req.query;
    const data = await getExchangeRates(base || 'INR');
    return res.json({ success: true, ...data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * @desc Convert Currency Amount
 * @route POST /api/itinerary/currency/convert
 */
async function convertCurrencyHandler(req, res) {
  try {
    const { amount, from, to } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }
    const result = await convertCurrency(Number(amount), from || 'INR', to || 'USD');
    return res.json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * @desc API Services Status Health Check
 * @route GET /api/itinerary/services/status
 */
function getServicesStatus(_req, res) {
  res.json({
    success: true,
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      googlePlaces: !!process.env.GOOGLE_MAPS_API_KEY,
      googleRoutes: !!process.env.GOOGLE_MAPS_API_KEY,
      openWeather: !!process.env.OPENWEATHER_API_KEY,
      aviationStack: !!process.env.AVIATIONSTACK_API_KEY,
      exchangeRate: !!process.env.EXCHANGERATE_API_KEY,
    },
  });
}

module.exports = {
  generateItinerary,
  getRouteHandler,
  searchPlacesHandler,
  searchHotelsHandler,
  searchFlightsHandler,
  searchTrainsHandler,
  getCurrencyRatesHandler,
  convertCurrencyHandler,
  getServicesStatus,
};
