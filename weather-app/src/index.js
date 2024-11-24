import "./styles.css";
import {
  displayGreeting,
  displayWeather,
  initializeSearchListener,
} from "./js_files/dom.js";
import { getWeatherData } from './js_files/api.js';

// When user searches for a city
const handleSearch = async (city) => {
    try {
        const weatherData = await getWeatherData(city);
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Initialize the application
const initApp = () => {
  displayGreeting();
  initializeSearchListener(handleSearch);
};

document.addEventListener("DOMContentLoaded", initApp);
