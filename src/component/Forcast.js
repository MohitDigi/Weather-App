import React, { useState, useEffect } from "react";
import axios from "axios";
import apikey from "./apikey";
import ReactAnimatedWeather from "react-animated-weather";

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});

  const search = (city) => {
    axios
      .get(
        `${apikey.base}weather?q=${
          city != "[object Object]" ? city : query
        }&units=metric&APPID=${apikey.key}`
      )
      .then((response) => {
        setWeather(response.data);
        setQuery("");
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  useEffect(() => {
    search("london");
  }, []);

  return (
    <div className="forecast">
      <ul>
        {typeof weather.main != "undefined" ? (
          <>
            <div className="forecast-icon">
              <img
                className="temp"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt=""
              />
            </div>
            <div className="today-weather">
              <h3>{Math.round(weather.main.temp)}°c ({weather.weather[0].main})</h3>
              <div className="search-box">
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search any city"
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />

                <div className="img-box">
                  {" "}
                  <img
                    src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
                    onClick={search}
                    alt=""
                  />
                </div>
              </div>

              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                {/* <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt=""
                /> */}
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility{" "}
                <span className="temp">
                  {Math.round(weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">
                  {Math.round(weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          </>
        ) : (
          <li>
            {error.query} {error.message}
          </li>
        )}
      </ul>
    </div>
  );
}
export default Forcast;
