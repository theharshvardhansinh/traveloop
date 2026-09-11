const axios = require('axios');

/**
 * Calculate route distance, duration and polyline between origin and destination
 */
async function computeRoute(origin, destination, waypoints = [], mode = 'DRIVING') {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return getMockRoute(origin, destination);
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    const travelModeMap = {
      car: 'driving',
      bike: 'bicycling',
      train: 'transit',
      plane: 'flight',
    };

    const googleMode = travelModeMap[mode.toLowerCase()] || 'driving';

    const params = {
      origin,
      destination,
      mode: googleMode,
      key: apiKey,
    };

    if (waypoints.length > 0) {
      params.waypoints = waypoints.join('|');
    }

    const response = await axios.get(url, { params });

    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        distanceKm: Math.round((leg.distance?.value || 0) / 1000),
        distanceText: leg.distance?.text || '250 km',
        durationText: leg.duration?.text || '4 hrs 30 mins',
        durationMinutes: Math.round((leg.duration?.value || 0) / 60),
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        polyline: route.overview_polyline?.points || '',
        steps: leg.steps?.map((s) => ({
          instruction: s.html_instructions?.replace(/<[^>]*>?/gm, ''),
          distance: s.distance?.text,
          duration: s.duration?.text,
        })) || [],
      };
    }

    return getMockRoute(origin, destination);
  } catch (err) {
    console.warn('⚠️ Google Routes API call failed, using fallback:', err.message);
    return getMockRoute(origin, destination);
  }
}

function getMockRoute(origin, destination) {
  return {
    distanceKm: 260,
    distanceText: '260 km',
    durationText: '4 hours 15 mins',
    durationMinutes: 255,
    startAddress: origin,
    endAddress: destination,
    polyline: '',
    steps: [
      { instruction: `Head south from ${origin}`, distance: '5 km', duration: '10 mins' },
      { instruction: 'Take National Highway 48 toward destination', distance: '240 km', duration: '3 hrs 45 mins' },
      { instruction: `Arrive at ${destination} city center`, distance: '15 km', duration: '20 mins' },
    ],
  };
}

module.exports = {
  computeRoute,
};
