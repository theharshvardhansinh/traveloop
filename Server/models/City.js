// models/City.js — re-exports the Drizzle `cities` table
const { cities, citiesRelations } = require('../db/schema');
module.exports = { cities, citiesRelations };
