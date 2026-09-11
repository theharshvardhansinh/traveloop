// models/Activity.js — re-exports the Drizzle `activities` table
const { activities, stopActivities, activitiesRelations, stopActivitiesRelations } = require('../db/schema');
module.exports = { activities, stopActivities, activitiesRelations, stopActivitiesRelations };
