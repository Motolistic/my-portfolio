async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const output = document.getElementById("weatherResult");

  try {
    const apiKey = "fd6d950a88984ab985b215118251407";
    const currentUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;

    const currentResponse = await fetch(currentUrl);
    const forecastResponse = await fetch(forecastUrl);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    const current = currentData.current;
    const location = currentData.location;
    const forecast = forecastData.forecast.forecastday;

    const weatherHTML = `
    <div class="weatherInfo">
     <div class"recentWeather">
      <h2>${location.name}, ${location.country}</h2>
      <p><strong>Local Time:</strong> ${location.localtime}</p>
      <img src="https:${current.condition.icon}" alt="Weather Icon">
      <p><strong>Temperature:</strong> ${current.temp_c}°C</p>
      <p><strong>Condition:</strong> ${current.condition.text}</p>
      <p><strong>Feels Like:</strong> ${current.feelslike_c}°C</p>
      <p><strong>Humidity:</strong> ${current.humidity}%</p>
      <p><strong>Wind:</strong> ${current.wind_kph} kph</p>
     </div> 

      <div class="forecast">
        <h3>3-Day Forecast: </h3>
        ${forecast
          .map(
            (day) => `
          <div class="forecast-day">
            <p><strong>${day.date}</strong></p>
            <img src="https:${day.day.condition.icon}" alt="Forecast Icon">
            <p>${day.day.condition.text}</p>
            <p>Avg Temp: ${day.day.avgtemp_c}°C</p>
          </div>
    
        `
          )
          .join("")}
      </div>
    </div> 
    `;

    output.innerHTML = weatherHTML;
  } catch (error) {
    output.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

