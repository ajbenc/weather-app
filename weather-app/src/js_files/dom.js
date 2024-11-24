import {
  formatTime,
  roundTemperature,
  capitalizeLocation,
  getWeatherIconClass,
  formatHumidity,
  formatWeatherDescription,
  formatWindDirection,
  formatDate
} from "./utils.js";

// DOM element selections
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchLocation");
const greetingContainer = document.querySelector("#greeting");
const forecastContainer = document.querySelector("#forecast");
const errorContainer = document.createElement('div'); // For error messages
errorContainer.className = 'error-container';
let cachedTemperatureContainer = null;

// Add loading state management
const setLoadingState = (isLoading) => {
    const searchBtn = document.querySelector("#searchBtn");
    const searchInput = document.querySelector("#searchLocation");
    const searchIcon = searchBtn.querySelector("i");
    
    searchBtn.disabled = isLoading;
    searchInput.disabled = isLoading;
    
    if (isLoading) {
        // Change icon to spinner
        searchIcon.classList.remove("fa-search");
        searchIcon.classList.add("fa-spinner", "fa-spin");
    } else {
        // Show success briefly then revert to search icon
        searchIcon.classList.remove("fa-spinner", "fa-spin");
        searchIcon.classList.add("fa-check");
        
        setTimeout(() => {
            searchIcon.classList.remove("fa-check");
            searchIcon.classList.add("fa-search");
        }, 1000);
    }
    
    if (isLoading) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-spinner';
        forecastContainer.prepend(loadingDiv);
    } else {
        const spinner = forecastContainer.querySelector('.loading-spinner');
        if (spinner) spinner.remove();
    }
};

// Add error display
const displayError = (message) => {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000); // Hide after 5 seconds
};

/**
 * @returns {HTMLElement} The temperature container element
 * @throws {Error} If the element is not found
 */
function getTemperatureContainer() {
  if (!cachedTemperatureContainer) {
    cachedTemperatureContainer = document.querySelector(
      ".temperature-container"
    );
    if (!cachedTemperatureContainer) {
      throw new Error(
        "Element with class `temperature-container` not found in the DOM."
      );
    }
  }
  return cachedTemperatureContainer;
}

const temperatureContainer = (() => {
  const element = getTemperatureContainer();
  return () => element;
})();

// Function to display greeting
const displayGreeting = () => {
  const currentHour = new Date().getHours();
  let greeting = "";

  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  greetingContainer.textContent = `${greeting}, User!`;
};

// Function to create and append a weather info paragraph
const createWeatherParagraph = (className, text) => {
    const p = document.createElement('p');
    if (className) {
        // Create an icon span if className includes Font Awesome classes
        if (className.includes('fa-')) {
            const icon = document.createElement('i');
            className.split(' ').forEach(cls => icon.classList.add(cls));
            p.appendChild(icon);
            // Add the text after the icon
            p.appendChild(document.createTextNode(` ${text}`));
        } else {
            p.className = className;
            p.textContent = text;
        }
    } else {
        p.textContent = text;
    }
    return p;
};

// Function to create a forecast period element
const createForecastPeriod = (title, forecast) => {
    const div = document.createElement('div');
    div.className = 'forecast-period';
    
    // Create a wrapper for all content to enable row layout
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'forecast-content';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'forecast-title';
    titleDiv.textContent = title;
    
    const iconDiv = document.createElement('div');
    iconDiv.className = 'weather-icon-container';
    const icon = document.createElement('i');
    const iconClasses = getWeatherIconClass(forecast.icon);
    iconClasses.split(' ').forEach(cls => icon.classList.add(cls));
    iconDiv.appendChild(icon);
    
    const tempDiv = document.createElement('div');
    tempDiv.className = 'forecast-temperature';
    tempDiv.textContent = `${roundTemperature(forecast.temp)}°C`;
    
    const conditionsDiv = document.createElement('div');
    conditionsDiv.className = 'forecast-conditions';
    conditionsDiv.textContent = formatWeatherDescription(forecast.conditions);
    
    contentWrapper.append(titleDiv, iconDiv, tempDiv, conditionsDiv);
    div.appendChild(contentWrapper);
    return div;
};

// Function to create an extended forecast day element
const createExtendedForecastDay = (forecast) => {
    const dayElement = document.createElement('div');
    dayElement.className = 'extended-forecast-day';
    
    const dateElement = document.createElement('div');
    dateElement.className = 'forecast-date';
    dateElement.textContent = formatDate(forecast.date);
    
    const conditionsElement = document.createElement('div');
    conditionsElement.className = 'forecast-conditions';
    
    const icon = document.createElement('i');
    icon.className = getWeatherIconClass(forecast.icon);
    
    const conditions = document.createElement('span');
    conditions.textContent = formatWeatherDescription(forecast.conditions);
    
    conditionsElement.append(icon, conditions);
    
    const tempElement = document.createElement('div');
    tempElement.className = 'forecast-temp';
    tempElement.textContent = `${roundTemperature(forecast.tempmax)}°C / ${roundTemperature(forecast.tempmin)}°C`;
    
    dayElement.append(dateElement, conditionsElement, tempElement);
    return dayElement;
};

// Function to display weather data
const displayWeather = (weatherData) => {
    try {
        if (!weatherData) throw new Error('No weather data available');
        
        errorContainer.style.display = 'none';
        const formattedCity = capitalizeLocation(weatherData.city);
        
        // Clear existing content
        const tempContainer = temperatureContainer();
        tempContainer.textContent = '';
        forecastContainer.textContent = '';
        
        // Create current weather elements
        const cityHeader = document.createElement('h3');
        cityHeader.textContent = `Today's Weather in ${formattedCity}`;
        
        // Append current weather info
        tempContainer.append(
            cityHeader,
            createWeatherParagraph(
                getWeatherIconClass(weatherData.icon),
                `${roundTemperature(weatherData.temperature)}°C`
            ),
            createWeatherParagraph('', `Conditions: ${formatWeatherDescription(weatherData.condition)}`),
            createWeatherParagraph('', `Humidity: ${formatHumidity(weatherData.humidity)}`),
            createWeatherParagraph('', `Wind Direction: ${formatWindDirection(weatherData.windDirection)}`),
            createWeatherParagraph('', `Last updated: ${formatTime(weatherData.currentConditions.datetime)}`)
        );
        
        // Create forecast elements
        const forecastTitle = document.createElement('h2');
        forecastTitle.textContent = 'How is the temperature today?';
        
        const dailyForecast = document.createElement('div');
        dailyForecast.className = 'daily-forecast';
        
        // Add time period forecasts
        dailyForecast.append(
            createForecastPeriod('Morning', weatherData.forecast[0].morning),
            createForecastPeriod('Afternoon', weatherData.forecast[0].afternoon),
            createForecastPeriod('Evening', weatherData.forecast[0].evening),
            createForecastPeriod('Night', weatherData.forecast[0].night)
        );
        
        // Create tomorrow's forecast
        const tomorrowSection = document.createElement('div');
        tomorrowSection.className = 'tomorrow-forecast';
        
        const tomorrowTitle = document.createElement('h3');
        tomorrowTitle.textContent = 'Tomorrow';
        
        const tomorrowSummary = document.createElement('div');
        tomorrowSummary.className = 'forecast-content';
        
        // Create wrapper divs for each piece of information
        const titleDiv = document.createElement('div');
        titleDiv.className = 'forecast-title';
        titleDiv.appendChild(tomorrowTitle);
        
        const iconTempDiv = document.createElement('div');
        iconTempDiv.className = 'weather-icon-container';
        const icon = document.createElement('i');
        const iconClasses = getWeatherIconClass(weatherData.forecast[1].icon);
        iconClasses.split(' ').forEach(cls => icon.classList.add(cls));
        iconTempDiv.appendChild(icon);
        
        const tempDiv = document.createElement('div');
        tempDiv.className = 'forecast-temperature';
        tempDiv.innerHTML = `High: ${roundTemperature(weatherData.forecast[1].tempmax)}°C<br>
                            Low: ${roundTemperature(weatherData.forecast[1].tempmin)}°C`;
        
        const conditionsDiv = document.createElement('div');
        conditionsDiv.className = 'forecast-conditions';
        conditionsDiv.textContent = formatWeatherDescription(weatherData.forecast[1].conditions);
        
        // Append all elements to the summary div
        tomorrowSummary.append(titleDiv, iconTempDiv, tempDiv, conditionsDiv);
        
        // Append summary to section
        tomorrowSection.appendChild(tomorrowSummary);
        
        // Append all forecast elements
        forecastContainer.append(forecastTitle, dailyForecast, tomorrowSection);
        
        // Add extended forecast
        const extendedForecastContainer = document.querySelector('#extendedForecast');
        extendedForecastContainer.textContent = ''; // Clear existing content
        
        const extendedTitle = document.createElement('h2');
        extendedTitle.textContent = 'Weather Forecast';
        extendedForecastContainer.appendChild(extendedTitle);
        
        const forecastGrid = document.createElement('div');
        forecastGrid.className = 'extended-forecast-grid';
        
        weatherData.extendedForecast.forEach(day => {
            forecastGrid.appendChild(createExtendedForecastDay(day));
        });
        
        extendedForecastContainer.appendChild(forecastGrid);
        
    } catch (error) {
        displayError(`Failed to display weather: ${error.message}`);
        console.error('Display error:', error);
    }
};

// Add input validation
const validateCityInput = (city) => {
    if (!city) throw new Error('Please enter a city name');
    if (city.length < 2) throw new Error('City name too short');
    if (!/^[a-zA-Z\s-]+$/.test(city)) throw new Error('Invalid city name format');
    return city;
};

// Update search listener with validation
const initializeSearchListener = (searchCallback) => {
    // Add error container to DOM
    document.querySelector('.container').prepend(errorContainer);
    
    searchBtn.addEventListener("click", async () => {
        try {
            const location = searchInput.value.trim();
            validateCityInput(location);
            setLoadingState(true);
            await searchCallback(location);
        } catch (error) {
            displayError(error.message);
        } finally {
            setLoadingState(false);
        }
    });

    // Add enter key support
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
};

function showLoading() {
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    document.querySelector('.weather-container').appendChild(loadingSpinner);
}

function hideLoading() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.remove();
}

function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    document.querySelector('.weather-container').appendChild(errorContainer);
    setTimeout(() => errorContainer.remove(), 3000); // Remove after 3 seconds
}

// Export functions to be used in index.js
export {
    displayGreeting,
    displayWeather,
    initializeSearchListener,
    setLoadingState,
    displayError,
    showLoading,
    hideLoading,
    showError
};
