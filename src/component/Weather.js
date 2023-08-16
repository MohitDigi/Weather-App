import React, { useState, useEffect } from "react";
import apikey from "./apikey";
import Clock from "react-live-clock";
import Forcast from "./Forcast";
import loader from "../images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
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
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    main: undefined,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          getWeather(28.67, 77.22);
          alert("You have disabled location service...");
        });
    } else {
      alert("Geolocation not available");
    }

    const timerID = setInterval(() => {
      getWeather(weatherData.lat, weatherData.lon);
    }, 600000);

    return () => clearInterval(timerID);
  }, []);

  const getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apikey.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apikey.key}`
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
        icon = "WIND";
        break;
      case "Drizzle":
        icon = "SLEET";
        break;
      case "Fog":
        icon = "FOG";
        break;
      case "Smoke":
        icon = "FOG";
        break;
      case "Tornado":
        icon = "WIND";
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
      main: main,
      country: data.sys.country,
      icon: icon,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <>
        {" "}
        <div className="loader-wrapper">
          <img src={loader} style={{ width: "35%", WebkitUserDrag: "none" }} alt=""/>
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location wil be displayed on the App <br></br> & used
            for calculating Real time weather.
          </h3>
        </div>
      </>
    );
  } else {
    const { city, country, icon, main, temperatureC } = weatherData;
    return (
      <>
        <div className="main-wrapper">
          <div className="city">
            <div className="title-wrapper">
              <div className="current-location">Current</div>
              <div className="title">
                <h2>{city}</h2>
                <h3>{country}</h3>
              </div>
            </div>
            <div className="mb-icon">
              <ReactAnimatedWeather
                icon={icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p className="main">{main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </div>
          <Forcast icon={icon} weather={main} />
        </div>
      </>
    );
  }
};

export default Weather;
