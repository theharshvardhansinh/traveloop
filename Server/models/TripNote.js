// models/TripNote.js — re-exports the Drizzle `tripNotes` table
const { tripNotes, tripNotesRelations } = require('../db/schema');
module.exports = { tripNotes, tripNotesRelations };
