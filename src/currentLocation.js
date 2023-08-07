
import "./current.css"

import React, { useState, useEffect } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {

};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  });
  const [weatherData2, setWeatherData2] = useState({})

  const [isLoading, setIsLoading] = useState(true);

  const getPosition = (options) => {  
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat, lon) => {
    try {
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await api_call.json();

      const main = data.weather[0].main;

      let icon = "CLEAR_DAY";
      switch (main) {
        case "Haze":
          icon = "CLEAR_DAY";
          break;
        case "Clouds":
          icon = "CLOUDY";
          break;
        case "Rain":
          icon = "RAIN";
          break;
        case "Snow":
          icon = "SNOW";
          break;
        case "Dust":
        case "Smoke":
        case "Tornado":
          icon = "WIND";
          break;
        case "Drizzle":
          icon = "SLEET";
          break;
        case "Fog":
          icon = "FOG";
          break;
        default:
          icon = "CLEAR_DAY";
      }

      setWeatherData({
        lat: lat,
        lon: lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main,
        country: data.sys.country,
        icon,
      });
      debugger
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(28.67, 77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }

  }, []);

  useEffect(() => {
    
    const timerID = setInterval(() => {
      setWeatherData2(weatherData)
      getWeather(weatherData.lat, weatherData.lon)}, 
    30000);

    return () => clearInterval(timerID);
    
  }, [weatherData.lat , weatherData.lon])

  if (isLoading) {
    return (
      <React.Fragment>
        <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} alt="" />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "6000" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location will be displayed on the App <br></br> & used
          for calculating Real time weather.
        </h3>
      </React.Fragment>
    );
  }

  return (
   
    <React.Fragment>
      <div className="city">
        <div className="title">
          <h2>{weatherData.city}</h2>
          <h3>{weatherData.country}</h3>
        </div>
        <div className="mb-icon">
          {" "}
          <ReactAnimatedWeather
            icon={weatherData.icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
          <p>{weatherData.main}</p>
        </div>
        <p className="current">Current Location & Search City</p>
        <div className="date-time">
          <div className="dmy">
            <div id="txt"></div>
            <div className="current-time">
              <Clock format="HH:mm:ss" interval={1000} ticking={true} />
            </div>
            <div className="current-date">{dateBuilder(new Date())}</div>
          </div>
         
          <div className="temperatureprev">
            {weatherData2.temperatureC &&
            <p>
              Previous: {weatherData2.temperatureC}°<span>C</span>
            </p>
            }+  
            <p>
              Current: {weatherData.temperatureC}°<span>C</span>
            </p>
          </div>
        </div>
      </div>
      <Forcast icon={weatherData.icon} weather={weatherData.main} />
    </React.Fragment>
  );
};

export default Weather;
