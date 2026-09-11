// models/Trip.js — re-exports the Drizzle `trips` and `tripMembers` tables
const { trips, tripMembers, tripsRelations, tripMembersRelations } = require('../db/schema');
module.exports = { trips, tripMembers, tripsRelations, tripMembersRelations };
