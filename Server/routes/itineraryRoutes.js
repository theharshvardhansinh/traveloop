const express = require('express');
const router = express.Router();
const {
  generateItinerary,
  searchPlacesHandler,
  searchHotelsHandler,
  getServicesStatus,
} = require('../controllers/itineraryController');

router.post('/generate', generateItinerary);
router.get('/places/search', searchPlacesHandler);
router.get('/places/hotels', searchHotelsHandler);
router.get('/services/status', getServicesStatus);

module.exports = router;
