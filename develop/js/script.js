$(function () {
  // Function variables
  const openWeatherAPIKey = "e4c1e13e847ec808a81db39a37789350";
  const searchButton = $("button");
  const weatherInfo = $("#weather-info");
  const inputField = $("#city");
  let cityName = $("#city-name");
  let forecastCityName = $("#forecast-city-name");
  const previousSearches = $("#search-list");
  const weatherForecast = $("#weather-info-forecast");
  let recentSearch = "Sydney";
  let pageInit = true;

  //Gathers information from localstorage, or sets array to blank if local is empty.
  let recentSearchArr = JSON.parse(localStorage.getItem("recentSearches")) || [
    "Sydney",
  ];

  createRecentButtons();

  console.log(recentSearchArr);

  function createRecentButtons() {
    previousSearches.empty();
    recentSearchArr.forEach((recentSearch) => {
      const recentBtn = $(
        "<button class='bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'></button>"
      );
      recentBtn.text(recentSearch);
      previousSearches.append(recentBtn);
  
      recentBtn.click(() => {
        inputField.val(recentSearch);
        weatherAPI(event);
      });
    });
  }
  
  // function createRecentButtons() {
  //   previousSearches.empty();
  //   recentSearchArr.forEach(recentSearch => {
  //     const recentBtn = $(
  //       "<button class='bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'></button>"
  //     );
  //     recentBtn.text(recentSearch);
  //     previousSearches.append(recentBtn);
  //   });
  // }
  
  // Function to create the previous searches button
  function createRecentButton (recentSearch) {
    if (pageInit === false) {
      let firstRecentSearch = previousSearches.children().last();

      if (recentSearchArr.length >= 5) {
        recentSearchArr.pop();
        firstRecentSearch.remove();
      }

      const recentBtn = $(
        "<button class='bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'></button>"
      );
      recentBtn.text(recentSearch);
      previousSearches.prepend(recentBtn);
      recentSearchArr.unshift(recentSearch);

      localStorage.setItem("recentSearches", JSON.stringify(recentSearchArr));
      return recentBtn;
    }
    pageInit = false;
  }

  // Function to get the weather icon emojis
  function getWeatherEmoji(iconCode) {
    switch (iconCode) {
      case "01d":
        return "☀️";
      case "01n":
        return "🌙";
      case "02d":
        return "⛅️";
      case "02n":
        return "☁️";
      case "03d":
      case "03n":
        return "☁️";
      case "04d":
      case "04n":
        return "☁️";
      case "09d":
      case "09n":
        return "🌧️";
      case "10d":
      case "10n":
        return "🌦️";
      case "11d":
      case "11n":
        return "⛈️";
      case "13d":
      case "13n":
        return "❄️";
      case "50d":
      case "50n":
        return "🌫️";
      default:
        return "";
    }
  }

  // Get current weather and weather forecast function
  function weatherAPI(e) {
    e.preventDefault();
    let city = inputField.val();
    let recentSearch = city;
    createRecentButton(recentSearch);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherAPIKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        weatherInfo.empty();
        const tempLi = document.createElement("li");
        let cityTemp = data.main.temp;
        tempLi.innerText = cityTemp;
        const windSpeedLi = document.createElement("li");
        let windSpeed = data.wind.speed;
        windSpeedLi.innerText = windSpeed;
        const humidityLi = document.createElement("li");
        let cityHumidity = data.main.humidity;
        humidityLi.innerText = cityHumidity;
        let weatherIcon = data.weather[0].icon;
        let weatherEmoji = getWeatherEmoji(weatherIcon);
        cityName.text(city);
        weatherInfo.attr("class", "text-gray-200 text-base font-bold p-2");
        tempLi.innerText = `Temperature: ${cityTemp}°C ${weatherEmoji}`;
        windSpeedLi.innerText = `Wind speed: ${windSpeed} meter/sec`;
        humidityLi.innerText = `Humidity: ${cityHumidity}%`;
        weatherInfo.append(tempLi);
        weatherInfo.append(windSpeedLi);
        weatherInfo.append(humidityLi);
      });
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherAPIKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        weatherForecast.empty();
        forecastCityName.text(city);
        weatherForecast.attr(
          "class",
          "flex flex-row space-x-5 p-2 m-3 w-full text-gray-200 text-base font-bold"
        );
        for (let i = 7, count = 0; count < 4; i += 8, count++) {
          const forecastLi = document.createElement("div");
          const forecastDateUl = document.createElement("ul");
          forecastDateUl.setAttribute("class", "flex flex-wrap");
          const forecastTempLi = document.createElement("li");
          const forecastWindSpeedLi = document.createElement("li");
          const forecastHumidityLi = document.createElement("li");
          const forecastDate = new Date(data.list[i].dt_txt);
          const forecastDateStr = forecastDate.toLocaleDateString();
          let forecastCityTemp = data.list[i].main.temp;
          let forecastWindSpeed = data.list[i].wind.speed;
          let forecastHumidity = data.list[i].main.humidity;
          let weatherIcon = data.list[i].weather[0].icon;
          let weatherEmoji = getWeatherEmoji(weatherIcon);
          forecastDateUl.innerText = `Date: ${forecastDateStr} ${weatherEmoji}`;
          forecastTempLi.innerText = `Temperature: ${forecastCityTemp}°C`;
          forecastWindSpeedLi.innerText = `Wind speed: ${forecastWindSpeed} meter/sec`;
          forecastHumidityLi.innerText = `Humidity: ${forecastHumidity}%`;
          forecastLi.append(forecastDateUl);
          forecastLi.append(forecastTempLi);
          forecastLi.append(forecastWindSpeedLi);
          forecastLi.append(forecastHumidityLi);
          weatherForecast.append(forecastLi);
        }
      });
  }

  $("#submit-city").on("click", weatherAPI);
  // End funciton

  // Current day display
  const currentDate = $("#currentDay");
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  // Update its text content to the current date
  currentDate.text(new Date().toLocaleDateString("en-UK", options));
  // End function

  $(document).on("click", "#search-list button", function(event){
    let buttonContent = $(this).text();
    inputField.val(buttonContent);
    let city = inputField.val()
    weatherAPI(inputField.val());
  })

//   searchButton.on("click", function(event){
//     event.preventDefault();
//     let city = inputField.val()
//     weatherAPI(city);
    
// })
});
