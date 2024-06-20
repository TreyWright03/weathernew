// Function to fetch weather data
async function fetchWeatherData(locationCode) {
    const forecastUrl = `https://api.weather.gov/gridpoints/MEG/${locationCode}/forecast/hourly`;

    try {
        const response = await axios.get(forecastUrl, {
            headers: {}
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching weather data: ${error}`);
        return null;
    }
}
// funcion to convert the short forcast into our own weather icons
function getWeatherIcon(shortForecast) {
    if (shortForecast.includes('Sunny')) {
        return 'Sunny.png';
    } else if (shortForecast.includes('Mostly Sunny')) {
        return 'Sunny.png';
    } else if (shortForecast.includes('Partly Sunny')) {
        return 'Sunny.png';
    } else if (shortForecast.includes('Mostly Clear')) {
    return 'Sunny.png';
    } else if (shortForecast.includes('Partly Cloudy')) {
        return 'PartlyCloudy.png';
    } else if (shortForecast.includes('Mostly Cloudy')) {
        return 'Cloudy.png';
    }   
    return 'Overflow.png'; // if a weather condition is not declared above this image will be displayed so we know we need to add an image for it
}

// Function to format and display weather information in HTML
async function displayWeatherInfo(locationCode) {
    try {
        const weatherData = await fetchWeatherData(locationCode);

        if (!weatherData || !weatherData.properties || !weatherData.properties.periods) {
            console.error('Invalid weather data format');
            return;
        }

        const periods = weatherData.properties.periods;

        // Find the current hour index
        const currentHourIndex = findCurrentHourIndex(periods);

        // Display the current hour's data in the specified boxes
        const currentPeriod = periods[currentHourIndex];

        // Convert start time to 12-hour format
        const startTime = convertTo12Hour(currentPeriod.startTime);

        const currentImage = getWeatherIcon(currentPeriod.shortForecast); 
        
        // Populate the weather boxes with the current hour's data
        document.getElementById('weather-box-Disp').innerHTML = `<p>Current</p>`;
        document.getElementById('weather-box-TempDisp').innerHTML = `<p>${currentPeriod.temperature} °F</p>`;
        document.getElementById('weather-box-IconDisp').innerHTML = `<img src="${currentImage}">`;
        document.getElementById('weather-box-TL').innerHTML = `<p>${currentPeriod.shortForecast}</p>`;
        document.getElementById('weather-box-BR').innerHTML = `<p>Precipitation Chance: ${currentPeriod.probabilityOfPrecipitation.value}%</p>`;
        document.getElementById('weather-box-TR').innerHTML = `<p>Humidty: ${currentPeriod.relativeHumidity.value}%</p>`;
        document.getElementById('weather-box-BL').innerHTML = `<p>${currentPeriod.windSpeed} Winds</p>`;
        
    
        // Iterate through each period starting from the next hour and update HR1 to HR4
        for (let i = 1; i <= 5; i++) {
            const containerId = `weather-box-HR${i}`;
            const weatherContainer = document.getElementById(containerId);

            if (weatherContainer) {
                weatherContainer.innerHTML = ''; // Clear previous content

                const period = periods[currentHourIndex + i];

                // Convert start and end times to 12-hour format
                const startTime = convertTo12Hour(period.startTime);
                const endTime = convertTo12Hour(period.endTime);

                // Convert wind speed from "5 mph" to "5 MPH"
                const windSpeed = period.windSpeed.toUpperCase();

                // Get custom image based on the short forecast
                const WeatherIcon = getWeatherIcon(period.shortForecast);

                const periodDiv = document.createElement('div');
                periodDiv.classList.add('weather-period');

                periodDiv.innerHTML = `
                    <p>${startTime}</p>
                    <img src="${WeatherIcon}">
                    <p>${period.temperature} °F</p>      
                `;

                weatherContainer.appendChild(periodDiv);
            } else {
                console.error(`Weather container ${containerId} not found.`);
            }
        }

    } catch (error) {
        console.error(`Error displaying weather info: ${error}`);
    }
}

// Helper function to find the index of the current hour's data
function findCurrentHourIndex(periods) {
    const currentDateTime = new Date();

    for (let i = 0; i < periods.length; i++) {
        const startTime = new Date(periods[i].startTime);
        const endTime = new Date(periods[i].endTime);

        if (currentDateTime >= startTime && currentDateTime < endTime) {
            return i;
        }
    }

    // Default to the first hour if current hour not found
    return 0;
}

// Helper function to convert time to 12-hour format
function convertTo12Hour(timeString) {
    const time = new Date(timeString);
    return time.toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true
    }).replace(':00', ''); 
}

const locationCode = '36,89'; // Replace with your location code
displayWeatherInfo(locationCode);

//Union City weather Api
//https://api.weather.gov/gridpoints/MEG/36,89/forecast/hourly