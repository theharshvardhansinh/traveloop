// models/TrainBooking.js — re-exports the Drizzle `trainBookings` table
const { trainBookings, trainBookingsRelations } = require('../db/schema');
module.exports = { trainBookings, trainBookingsRelations };
