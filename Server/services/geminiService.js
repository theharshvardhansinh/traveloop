const { GoogleGenAI } = require('@google/genai');

/**
 * Generate dynamic itinerary using Google Gemini 2.5 Flash
 */
async function generateItineraryWithGemini(params) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in Server/.env');
  }

  const ai = new GoogleGenAI({ apiKey });

  const {
    startLocation,
    destination,
    travelMode = 'car',
    groupType = 'couple',
    tripTheme = 'combined',
    startDate,
    endDate,
    themeSliders = { spiritual: 40, nature: 30, adventure: 30 },
  } = params;

  // Calculate duration in days
  let totalDays = 3;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(totalDays) || totalDays < 1) totalDays = 3;
    if (totalDays > 14) totalDays = 14; // Cap for optimal API performance
  }

  const prompt = `
You are an expert travel planner for Traveloop. Generate a highly detailed, personalized ${totalDays}-day trip itinerary based on the following preferences:

- Start Location: ${startLocation}
- Destination: ${destination}
- Travel Mode: ${travelMode}
- Group Type: ${groupType} (Adjust pace, activity density, and stay style accordingly)
- Trip Theme: ${tripTheme} (Spiritual: ${themeSliders.spiritual}%, Nature: ${themeSliders.nature}%, Adventure: ${themeSliders.adventure}%)
- Travel Dates: ${startDate} to ${endDate} (${totalDays} days)

REQUIREMENTS:
1. Return ONLY valid JSON without any markdown formatting, code block markers (\`\`\`json), or raw text.
2. The output MUST strictly follow this JSON schema:

{
  "tripTitle": "Short catchy title for the trip",
  "destination": "${destination}",
  "startLocation": "${startLocation}",
  "totalDays": ${totalDays},
  "summary": "Brief 2-3 sentence overview of the trip experience",
  "recommendedStayArea": "Best neighborhood/area to stay",
  "estimatedBudgetINR": {
    "stay": 12000,
    "food": 6000,
    "activities": 4000,
    "transport": 5000,
    "total": 27000
  },
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "theme": "Spiritual / Cultural / Adventure",
      "weatherSummary": "Warm & Sunny, 28°C",
      "activities": [
        {
          "timeSlot": "Morning (09:00 AM - 12:00 PM)",
          "title": "Name of place/activity",
          "description": "Short engaging description of what to do here",
          "category": "Sightseeing / Dining / Adventure / Cultural",
          "locationName": "Exact spot name for map lookup",
          "estimatedCostINR": 500
        }
      ],
      "lunchStop": {
        "name": "Recommended Local Restaurant",
        "cuisine": "Local / North Indian / Multi-cuisine",
        "estimatedCostINR": 600
      },
      "nightStay": {
        "name": "Suggested Hotel / Resort",
        "category": "Boutique / Luxury / Budget",
        "estimatedCostPerNightINR": 4000
      }
    }
  ]
}

Make the recommendations authentic, practical for ${startLocation} to ${destination}, and tuned to ${groupType} travelers!
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const rawText = response.text || '';
    // Clean out markdown backticks if any
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResult = JSON.parse(cleanedText);
    return jsonResult;
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    throw error;
  }
}

module.exports = {
  generateItineraryWithGemini,
};
