// models/HotelBooking.js — re-exports the Drizzle `hotelBookings` table
const { hotelBookings, hotelBookingsRelations } = require('../db/schema');
module.exports = { hotelBookings, hotelBookingsRelations };
