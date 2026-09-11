// models/Expense.js — re-exports the Drizzle `expenses` and `expenseSplits` tables
const { expenses, expenseSplits, expensesRelations, expenseSplitsRelations } = require('../db/schema');
module.exports = { expenses, expenseSplits, expensesRelations, expenseSplitsRelations };
