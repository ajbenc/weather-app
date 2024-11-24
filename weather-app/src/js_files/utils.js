/**
 * Temperature Conversions
 */
// Converts a temperature from Celsius to Fahrenheit.
// Usage: Pass a numerical value representing Celsius temperature.
// Returns the equivalent temperature in Fahrenheit.
const celsiusToFahrenheit = (celsius) => {
  if (typeof celsius !== "number" || !isFinite(celsius)) {
    throw new Error("Invalid input: input must be a finite number");
  }
  return (celsius * 9/5) + 32;
};

const fahrenheitToCelsius = (fahrenheit) => {
  return ((fahrenheit - 32) * 5) / 9;
};

/**
 * Text Formatting
 */
const capitalizeLocation = (location) => {
  return location
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Date and Time Formatting
 */
const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatTime = (timeString) => {
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Wind Speed Conversions
 */
const kmhToMph = (kmh) => {
  return kmh * 0.621371;
};

const mphToKmh = (mph) => {
  return mph * 1.60934;
};

/**
 * Weather Description Formatting
 */
const formatWeatherDescription = (description) => {
  return description
    .split(",")
    .map((item) => item.trim())
    .join(", ");
};

/**
 * Temperature Rounding
 */
const roundTemperature = (temp) => {
  return Math.round(temp * 10) / 10;
};

/**
 * Get Weather Icon Class
 * Maps weather conditions to CSS classes or icon names
 */
const getWeatherIconClass = (condition) => {
  // Map weather conditions to Font Awesome icons and animation classes
  const iconMap = {
    'clear-day': 'fa-solid fa-sun sunny',
    'clear-night': 'fa-solid fa-moon',
    'partly-cloudy-day': 'fa-solid fa-cloud-sun cloudy',
    'partly-cloudy-night': 'fa-solid fa-cloud-moon cloudy',
    'cloudy': 'fa-solid fa-cloud cloudy',
    'rain': 'fa-solid fa-cloud-rain rainy',
    'snow': 'fa-solid fa-snowflake snowy',
    'sleet': 'fa-solid fa-cloud-sleet snowy',
    'wind': 'fa-solid fa-wind windy',
    'fog': 'fa-solid fa-smog mist',
    'thunder': 'fa-solid fa-cloud-bolt thunder',
    'hail': 'fa-solid fa-cloud-hail',
    'tornado': 'fa-solid fa-tornado windy',
    'hurricane': 'fa-solid fa-hurricane windy',
    'drizzle': 'fa-solid fa-cloud-drizzle rainy',
    'dust': 'fa-solid fa-dust mist',
    'smoke': 'fa-solid fa-smoke mist',
    'overcast': 'fa-solid fa-cloud cloudy',
    'haze': 'fa-solid fa-smog mist'
  };

  return iconMap[condition] || 'fa-solid fa-circle-question';
};

/**
 * Format Humidity
 */
const formatHumidity = (humidity) => {
  return `${Math.round(humidity)}%`;
};

/**
 * Get Time of Day
 */
const getTimeOfDay = (hour) => {
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 20) return "evening";
  return "night";
};

/**
 * Format Wind Direction
 */
const formatWindDirection = (degrees) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  capitalizeLocation,
  formatDate,
  formatTime,
  kmhToMph,
  mphToKmh,
  formatWeatherDescription,
  roundTemperature,
  getWeatherIconClass,
  formatHumidity,
  getTimeOfDay,
  formatWindDirection,
};
