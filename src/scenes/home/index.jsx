import React, { useState, useEffect } from 'react';

const Home = () => {
  const YOUR_API_KEY = "397bc1ef5b5164ddda358423e355bd0e"

  const [weatherData, setWeatherData] = useState(null);
  const [localName, setLocalName] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [state, setState] = useState(null);
  const [countryCode, setCountryCode] = useState(null);

  const getBackgroundImage = (description) => {
    switch (description) {
      case 'clear sky':
        return 'url(/weather-forecast/images/clear-sky.png)';
      case 'few clouds':
        return 'url(/weather-forecast/images/few-clouds.png)';
      case 'scattered clouds':
        return 'url(/weather-forecast/images/scattered-clouds.png)';
      case 'broken clouds':
        return 'url(/weather-forecast/images/broken-clouds.png)';
      case 'shower rain':
        return 'url(/weather-forecast/images/shower-rain.png)';
      case 'rain':
        return 'url(/weather-forecast/images/rain.png)';
      case 'thunderstorm':
        return 'url(/weather-forecast/images/thunderstorm.png)';
      case 'snow':
        return 'url(/weather-forecast/images/snow.png)';
      case 'mist':
        return 'url(/weather-forecast/images/mist.png)';
      default:
        return 'url(/weather-forecast/images/default.png)';
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp <= 0) return { color: 'rgb(0, 0, 255)' }; // Blue
    if (temp >= 45) return { color: 'rgb(255, 0, 0)' }; // Red

    let red, green, blue;

    if (temp <= 22.5) {
      // Transition from blue to light blue to yellow
      red = Math.floor((temp / 22.5) * 255);
      green = Math.floor((temp / 22.5) * 255);
      blue = 255;
    } else {
      // Transition from yellow to orange to red
      red = 255;
      green = Math.floor(((45 - temp) / 22.5) * 255);
      blue = 0;
    }

    return { color: `rgb(${red}, ${green}, ${blue})`, textShadow: '0 0 3px black' };
  };

  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '';
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude
          + '&appid=' + YOUR_API_KEY
          + '&units=metric');
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    };

    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const backgroundImage = weatherData ? getBackgroundImage(weatherData.weather?.[0]?.description) : 'url(/weather-forecast/images/default.png)';
    document.body.style.backgroundImage = backgroundImage;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }, [weatherData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-opacity-15 bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Weather Forecast App</h1>
      <p className="text-lg mb-6">Get the latest weather updates for your location.</p>
      <p className="text-lg mb-4">Enter your location below:</p>
      <input
        type="text"
        placeholder="Enter your location"
        className="border p-2 mb-4 w-full max-w-md text-black"
        onChange={async (e) => {
          await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + e.target.value
            + '&appid=' + YOUR_API_KEY
            + '&limit=10')
            .then((response) => response.json())
            .then((data) => {
              if (data.length > 0) {
                setLocalName(data[0].local_names?.te || data[0].name);
                setLatitude(data[0].lat);
                setLongitude(data[0].lon);
                setState(data[0].state);
                setCountryCode(data[0].country);
              } else {
                console.error('No data found for the given location');
              }
            });
        }}
      />
      {/* <button
        className="bg-blue-500 text-white p-2 rounded mb-4"
        onClick={async () => {
          await fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + location
            + '&appid=' + YOUR_API_KEY
            + '&limit=10')
            .then((response) => response.json())
            .then((data) => {
              if (data.length > 0) {
                setLocalName(data[0].local_names?.te || data[0].name);
                setLatitude(data[0].lat);
                setLongitude(data[0].lon);
                setState(data[0].state);
                setCountryCode(data[0].country);
              } else {
                console.error('No data found for the given location');
              }
            });
        }}
      >Get Weather</button> */}

      {
        weatherData && (
          <div className="mt-6 text-center">
            <h2 className="text-3xl font-semibold mb-4">
              <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="Weather Icon" className="inline-block ml-2 w-12 h-12" />
              Weather in {weatherData.name}
            </h2>
            <p className="text-lg">Local Name: {localName}</p>
            <p className="text-lg">State: {state}</p>
            <p className="text-lg">Country Code: {countryCode} {getFlagEmoji(countryCode)}</p>
            <p className="text-lg">Latitude: {latitude}</p>
            <p className="text-lg">Longitude: {longitude}</p>
            <p className="text-3xl" style={getTemperatureColor(Number(weatherData.main?.temp))}>Temperature: {weatherData.main?.temp}°C</p>
            <p className="text-lg">Humidity: {weatherData.main?.humidity}%</p>
            <p className="text-lg">Weather: {weatherData.weather?.[0]?.description}</p>
          </div>
        )
      }
    </div>
  );
};

export default Home;
