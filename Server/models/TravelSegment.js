// models/TravelSegment.js — re-exports the Drizzle `travelSegments` table
const { travelSegments, travelSegmentsRelations } = require('../db/schema');
module.exports = { travelSegments, travelSegmentsRelations };
