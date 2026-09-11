const axios = require('axios');

// In-memory cache for exchange rates (updates hourly)
let ratesCache = null;
let lastFetchTime = 0;

/**
 * Fetch live exchange rates base currency INR
 */
async function getExchangeRates(base = 'INR') {
  const now = Date.now();
  // Cache for 1 hour (3600000 ms)
  if (ratesCache && now - lastFetchTime < 3600000) {
    return ratesCache;
  }

  const apiKey = process.env.EXCHANGERATE_API_KEY;

  if (apiKey && apiKey !== 'YOUR_EXCHANGERATE_API_KEY') {
    try {
      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`;
      const response = await axios.get(url);
      if (response.data && response.data.conversion_rates) {
        ratesCache = {
          base,
          rates: response.data.conversion_rates,
          lastUpdated: new Date().toISOString(),
        };
        lastFetchTime = now;
        return ratesCache;
      }
    } catch (err) {
      console.warn('⚠️ ExchangeRate API call failed, using fallback:', err.message);
    }
  }

  // Standard static exchange rate fallback (base INR)
  ratesCache = {
    base: 'INR',
    rates: {
      INR: 1.0,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0094,
      AED: 0.044,
      CAD: 0.016,
      AUD: 0.018,
      SGD: 0.016,
      JPY: 1.78,
    },
    lastUpdated: new Date().toISOString(),
  };
  lastFetchTime = now;
  return ratesCache;
}

/**
 * Convert dynamic amount between currencies
 */
async function convertCurrency(amount, from = 'INR', to = 'USD') {
  const ratesData = await getExchangeRates('INR');
  const rates = ratesData.rates;

  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;

  // Convert from origin currency to INR first, then to target currency
  const amountInINR = amount / fromRate;
  const convertedAmount = amountInINR * toRate;

  return {
    originalAmount: amount,
    from,
    to,
    convertedAmount: Number(convertedAmount.toFixed(2)),
    rate: Number((toRate / fromRate).toFixed(4)),
  };
}

module.exports = {
  getExchangeRates,
  convertCurrency,
};
