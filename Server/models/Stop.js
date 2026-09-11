// models/Stop.js — re-exports the Drizzle `stops` table
const { stops, stopActivities, stopsRelations, stopActivitiesRelations } = require('../db/schema');
module.exports = { stops, stopActivities, stopsRelations, stopActivitiesRelations };
