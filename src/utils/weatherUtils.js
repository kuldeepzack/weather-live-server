const weatherIconsMap = {
    Haze: "CLEAR_DAY",
    Clouds: "CLOUDY",
    Rain: "RAIN",
    Snow: "SNOW",
    Dust: "WIND",
    Drizzle: "SLEET",
    Fog: "FOG",
    Smoke: "FOG",
    Tornado: "WIND",
    default: "CLEAR_DAY",
  };
  
  export const getWeatherIcon = (weather) => {
    return weatherIconsMap[weather] || weatherIconsMap.default;
  };
  