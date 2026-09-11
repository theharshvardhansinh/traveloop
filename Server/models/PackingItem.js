// models/PackingItem.js — re-exports the Drizzle `packingItems` table
const { packingItems, packingItemsRelations } = require('../db/schema');
module.exports = { packingItems, packingItemsRelations };
