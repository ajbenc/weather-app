const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

// Add debug logging
console.log("API Key available:", !!API_KEY);

async function getWeatherData(city) {
  try {
    // Validate input
    if (!city || typeof city !== "string") {
      throw new Error("Invalid city parameter");
    }

    // Build the API URL with all necessary parameters
    const url = `${BASE_URL}/${encodeURIComponent(
      city
    )}?unitGroup=metric&key=${API_KEY}&include=current,hours,days&contentType=json&lang=en`;

    console.log("Fetching weather data..."); // Debug log

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      }
      throw new Error(`Weather service error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Debug log

    // Simplified data processing
    return {
      city: data.resolvedAddress,
      temperature: data.currentConditions?.temp || data.days[0]?.temp || 0,
      humidity: data.currentConditions?.humidity || data.days[0]?.humidity || 0,
      condition:
        data.currentConditions?.conditions ||
        data.days[0]?.conditions ||
        "Unknown",
      windDirection:
        data.currentConditions?.winddir || data.days[0]?.winddir || 0,
      icon: data.currentConditions?.icon || data.days[0]?.icon || "unknown",
      currentConditions: {
        datetime: data.currentConditions?.datetime || new Date().toISOString(),
      },
      forecast: [
        {
          morning: {
            temp: data.days[0]?.hours[8]?.temp || 0,
            conditions: data.days[0]?.hours[8]?.conditions || "No data",
            icon: data.days[0]?.hours[8]?.icon || "unknown",
          },
          afternoon: {
            temp: data.days[0]?.hours[14]?.temp || 0,
            conditions: data.days[0]?.hours[14]?.conditions || "No data",
            icon: data.days[0]?.hours[14]?.icon || "unknown",
          },
          evening: {
            temp: data.days[0]?.hours[18]?.temp || 0,
            conditions: data.days[0]?.hours[18]?.conditions || "No data",
            icon: data.days[0]?.hours[18]?.icon || "unknown",
          },
          night: {
            temp: data.days[0]?.hours[22]?.temp || 0,
            conditions: data.days[0]?.hours[22]?.conditions || "No data",
            icon: data.days[0]?.hours[22]?.icon || "unknown",
          },
        },
        {
          tempmax: data.days[1]?.tempmax || 0,
          tempmin: data.days[1]?.tempmin || 0,
          conditions: data.days[1]?.conditions || "No data",
          icon: data.days[1]?.icon || "unknown",
        },
      ],
      extendedForecast: data.days.slice(0, 14).map(day => ({
        date: day.datetime,
        tempmax: day.tempmax || 0,
        tempmin: day.tempmin || 0,
        conditions: day.conditions || "No data",
        icon: day.icon || "unknown",
        precipitation: day.precip || 0,
        humidity: day.humidity || 0
      }))
    };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export { getWeatherData };
