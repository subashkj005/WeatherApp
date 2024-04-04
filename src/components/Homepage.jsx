import React, { useState } from "react";
import weatherImage from "../assets/images/weather-bg.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { usePlacesWidget } from "react-google-autocomplete";
import clear from "../assets/images/clear.png";
import cloud from "../assets/images/cloud.png";
import drizzle from "../assets/images/drizzle.png";
import rain from "../assets/images/rain.png";
import snow from "../assets/images/snow.png";
import wind from "../assets/images/wind.png";
import humidity from "../assets/images/humidity.png";
import { API_KEY, GOOGLE_API_KEY } from "../constants/credentials";

function Homepage() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [wIcon, setwIcon] = useState(null);
  const [showSuggession, setShowSuggession] = useState(false)

  const { ref } = usePlacesWidget({
    apiKey: GOOGLE_API_KEY,
    onPlaceSelected: (place) =>
      setLocation(place.formatted_address.split(", ")[0]),
  });

  let today = new Date();
  let dayName = today.toLocaleString("en-US", { weekday: "long" });

  const updateIcon = (resData) => {
    if (
      resData.weather[0].icon === "01d" ||
      resData.weather[0].icon === "01n"
    ) {
      setwIcon(clear);
    } else if (
      resData.weather[0].icon === "02d" ||
      resData.weather[0].icon === "02n"
    ) {
      setwIcon(cloud);
    } else if (
      resData.weather[0].icon === "03d" ||
      resData.weather[0].icon === "03n"
    ) {
      setwIcon(drizzle);
    } else if (
      resData.weather[0].icon === "04d" ||
      resData.weather[0].icon === "04n"
    ) {
      setwIcon(drizzle);
    } else if (
      resData.weather[0].icon === "09d" ||
      resData.weather[0].icon === "09n"
    ) {
      setwIcon(rain);
    } else if (
      resData.weather[0].icon === "10d" ||
      resData.weather[0].icon === "10n"
    ) {
      setwIcon(rain);
    } else if (
      resData.weather[0].icon === "13d" ||
      resData.weather[0].icon === "13n"
    ) {
      setwIcon(rain);
    } else {
      setwIcon(clear);
    }
  };


  let suggessions = document.getElementsByClassName("pac-item");
  const handleLocationSelection = (value) => {
    setLocation(value)
    setShowSuggession(false)
  }

  const handleLocationChange = (e) =>{
    setLocation(e.target.value)
    setShowSuggession(true)
  }


  const handleSubmit = () => {
    const trimmedLocation = location;
    if (trimmedLocation) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${trimmedLocation}&units=Metric&appid=${API_KEY}`
        )
        .then((res) => {
          setWeatherData(res?.data);
          updateIcon(res?.data);
          setLocation("");
        })
        .catch((err) => {
          toast.error("Unable to get information.. 🙁");
        })
        .finally(() => {
          setLocation("");
        });
    }
  };
  return (
    <>
      <div className="wrapper w-screen h-screen">
        <div className="content w-full h-full flex items-center justify-center">
          <div className="left-content w-[55%] h-full pl-20 py-12 px-8">
            {weatherData.length !== 0 ? (
              <div className="w-full h-full">
                <div className="locationTab h-[4rem] w-full gap-4 flex items-center pl-2 font-medium">
                  <i class="lni lni-map-marker"></i>
                  <h1 className="text-[26px] text-white">
                    {weatherData?.name}
                  </h1>
                </div>
                <div className="tempLevel w-fullpl-2 flex gap-12">
                  <span>{Math.floor(weatherData?.main?.temp)}°C</span>
                  <img src={wIcon} alt="" />
                </div>
                <div className="">
                  <div className="font-bold text-5xl h-full flex place-content-between">
                    <div className="flex items-center p-4 ">
                      <h1>{dayName}</h1>
                    </div>
                    <div>
                      <div className="flex p-2 pr-10 items-center">
                        <i class="fi fi-rr-heat text-[2rem]"></i>
                        <div className="pl-2">
                          <p className="text-2xl font-semibold">
                            {weatherData?.main?.humidity} %
                          </p>
                          <p className="text-xs font-semibold">Humidity</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex p-3 items-center">
                          <i class="fa-solid fa-wind text-[2rem]"></i>
                          <div className="pl-2">
                            <p className="text-xl font-semibold">
                              {weatherData?.wind?.speed} km/hr
                            </p>
                            <p className="text-xs font-semibold">Wind speed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <p className="text-[3rem] font-semibold">Weather App</p>
              </div>
            )}
          </div>
          <div className="right-content w-[35%] h-full relative">
            <div className="flex items-center justify-center gap-3 absolute top-[2rem] left-[2rem] ">
              <input
                className="w-[18rem] h-[4rem] rounded-full text-[1.1rem] font- pl-8 text-black"
                type="text"
                placeholder="Search"
                value={location}
                onChange={(e) => handleLocationChange(e)}
                ref={ref}
              />
              <div
                className="iconButton rounded-full w-14 h-14 flex justify-center items-center hover:bg-[#ffffffa3] transition"
                onClick={handleSubmit}
              >
                <i className="searchIcon fa-solid fa-magnifying-glass block text-[2rem] rounded"></i>
              </div>
            </div>
            {showSuggession && suggessions.length > 0 && (
              <ul className="suggessionList absolute top-[6.4rem] left-[2rem] rounded bg-slate-100 w-[18rem] text-black z-10 max-h-60 overflow-y-auto scrollbar-hide">
                {Array.from(suggessions).map((suggession, index) => {
                  const value = suggession.innerText.split(/(?=[A-Z])/)[0];
                  return (
                    <li
                      key={index}
                      className="flex font-normal text-[1.2rem] p-1 pl-5 hover:bg-slate-300 rounded "
                      onClick={()=>handleLocationSelection(value)}
                    >
                      <i className="fa-solid fa-location-dot text-red-500 pt-1 pr-3"></i>
                        <span className="text-slate-600 ">{value} </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="weatherImage absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[18rem] p-4 z-0">
              <img src={weatherImage} alt="" />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
}

export default Homepage;
