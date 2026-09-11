const express = require('express');
const router = express.Router();
const {
  generateItinerary,
  getRouteHandler,
  searchPlacesHandler,
  searchHotelsHandler,
  searchFlightsHandler,
  searchTrainsHandler,
  getCurrencyRatesHandler,
  convertCurrencyHandler,
  getServicesStatus,
} = require('../controllers/itineraryController');

// AI Itinerary & Routing
router.post('/generate', generateItinerary);
router.get('/route', getRouteHandler);

// Places & Hotels
router.get('/places/search', searchPlacesHandler);
router.get('/places/hotels', searchHotelsHandler);

// Transport: Flights & Trains
router.get('/transport/flights', searchFlightsHandler);
router.get('/transport/trains', searchTrainsHandler);

// Currency Converter
router.get('/currency/rates', getCurrencyRatesHandler);
router.post('/currency/convert', convertCurrencyHandler);

// Health Check
router.get('/services/status', getServicesStatus);

module.exports = router;
