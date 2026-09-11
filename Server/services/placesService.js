const axios = require('axios');

/**
 * Service to interact with Google Places API
 */
async function searchPlaces(query, location = '') {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return getMockPlaces(query);
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const response = await axios.get(url, {
      params: {
        query: `${query} ${location}`.trim(),
        key: apiKey,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results.map((place) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating || 4.2,
        userRatingsTotal: place.user_ratings_total || 100,
        priceLevel: place.price_level,
        photoRef: place.photos?.[0]?.photo_reference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${apiKey}`
          : null,
        location: place.geometry?.location,
        types: place.types || [],
      }));
    }

    return getMockPlaces(query);
  } catch (err) {
    console.warn('⚠️ Google Places API call failed, using fallback:', err.message);
    return getMockPlaces(query);
  }
}

/**
 * Hotel/Stays search helper using Google Places lodging query
 */
async function searchHotels(city, budgetCategory = 'Boutique') {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return getMockHotels(city);
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const response = await axios.get(url, {
      params: {
        query: `${budgetCategory} hotels stays in ${city}`,
        type: 'lodging',
        key: apiKey,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results.map((h) => ({
        hotelId: h.place_id,
        name: h.name,
        address: h.formatted_address,
        rating: h.rating || 4.5,
        userRatingsTotal: h.user_ratings_total || 250,
        photoUrl: h.photos?.[0]?.photo_reference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photo_reference=${h.photos[0].photo_reference}&key=${apiKey}`
          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        location: h.geometry?.location,
      }));
    }

    return getMockHotels(city);
  } catch (err) {
    console.warn('⚠️ Google Hotels Search failed, using fallback:', err.message);
    return getMockHotels(city);
  }
}

// Fallback Mock Data for Places
function getMockPlaces(query) {
  return [
    {
      placeId: 'mock_1',
      name: `${query} Landmark`,
      address: `Central Spot, ${query}`,
      rating: 4.6,
      userRatingsTotal: 1240,
      photoRef: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
      location: { lat: 26.9124, lng: 75.7873 },
    },
    {
      placeId: 'mock_2',
      name: `${query} Heritage View`,
      address: `Old City Road, ${query}`,
      rating: 4.8,
      userRatingsTotal: 850,
      photoRef: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80',
      location: { lat: 26.9150, lng: 75.7900 },
    },
  ];
}

// Fallback Mock Data for Hotels
function getMockHotels(city) {
  return [
    {
      hotelId: 'h_1',
      name: `Grand Palace Hotel ${city}`,
      address: `Heritage Lane, ${city}`,
      rating: 4.7,
      userRatingsTotal: 480,
      photoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    },
    {
      hotelId: 'h_2',
      name: `Boutique Stays ${city}`,
      address: `Lakeview Promenade, ${city}`,
      rating: 4.5,
      userRatingsTotal: 320,
      photoUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
    },
  ];
}

module.exports = {
  searchPlaces,
  searchHotels,
};
