function getWeather() {
    const apiKey = 'a705dc62777a6255e6aff06c1a0c6262'; // Ensure this is a valid API key
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;
    
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);

            // Fetch hourly forecast if available
            fetchHourlyForecast(city);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Display hourly forecast for the next 24 hours (3-hour intervals)
    const next24Hours = hourlyData.list.slice(0, 8); 

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

function fetchHourlyForecast(city) {
    const apiKey = 'a705dc62777a6255e6aff06c1a0c6262'; // Ensure this is a valid API key
    const hourlyWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}`;

    fetch(hourlyWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
        });
}
