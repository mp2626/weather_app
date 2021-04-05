// vars
const searchButton = $("#search");
const citySpan = $("#citySpan");
const cards = $("#cards");
// api vars for functions
const api = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "&units=metric&appid=dafe53ce7645ef5b27a79562190e601b";
const weatherIconApi = "http://openweathermap.org/img/w/";
const apiUV = "https://api.openweathermap.org/data/2.5/uvi?";
const apiKeyUv = "&appid=dafe53ce7645ef5b27a79562190e601b";

let searchStore = [];

let city = "";
let cityLat = "";
let cityLon = "";
let weatherData = "";
let uvData = "";

// fetches API data for main forecast information and call create cards
function getForecast(event) {
    event.preventDefault();
    city = $(event.target).parents().find("input").val().toLowerCase().trim();
    searchApi = api + city + apiKey;
    $('#search-input').val('');

    fetch(searchApi)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("No result found for " + city)
            };
        })
        .then(data => {
            weatherData = data;
            cityLat = data.city.coord.lat;
            cityLon = data.city.coord.lon;
            searchUvApi = apiUV + "lat=" + cityLat + "&lon=" + cityLon + apiKeyUv;

            fetch(searchUvApi)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                })
                .then(data => {
                    console.log(data)
                    uvData = data.value;
                    createCards(weatherData);
                });
        });
};

// create cards and set attributes
function createCards(data) {

    let currentDate = '';
    let count = 0;

    console.log(data);
    console.log(data.list);

    citySpan.text(" - " + data.city.name);

    if ($('#cards').children('div')) {
        cards.children().remove('div');
    }

    for (let i = 0; i < data.list.length; i++) {

        if (currentDate !== moment(data.list[i].dt_txt).format('DD-MM-YYYY') && count <= 4) {
            // Gather data
            date = moment(data.list[i].dt_txt).format('DD-MM-YYYY');
            temp = data.list[i].main.temp_max;
            humidity = data.list[i].main.humidity;
            wind = data.list[i].wind.speed;
            // get wind and build icon sting
            weather = data.list[i].weather[0].description;
            weatherIcon = data.list[i].weather[0].icon;
            buildWeatherIconString = weatherIconApi + weatherIcon + ".png";
            // create elements and set data
            newCardDiv = $('<div>').addClass('card col-md-11 col-lg-2');
            cardDate = $('<h1>').addClass('card-header').text(date);
            cardBody = $('<div>').addClass('card-body');
            cardBodyImg = $('<img>').attr('src', buildWeatherIconString).attr('alt', "weather icon");
            cardTemp = $('<h2>').text('Temp(c): ' + temp);
            cardWind = $('<h2>').text('Wind: ' + wind);
            cardHumidity = $('<h2>').text('Humidity: ' + humidity);
            // Build cards
            cardBody.append(cardBodyImg, cardTemp, cardWind, cardHumidity);
            newCardDiv.append(cardDate, cardBody);
            cards.append(newCardDiv);
            // Update date and count to prevent multiple cards being built
            currentDate = moment(data.list[i].dt_txt).format('DD-MM-YYYY')
            count++
        }
    }
    // adds uv to fist card as per demo
    cardUv = $('<h2>').text('UV Index: ' + uvData);
    $('.card').children().eq(1).append(cardUv);
    // need to add in color code
    // calls save data function
    saveData()
}


// save search function local storage

function saveData() {
    searchStore.unshift(city);
    console.log(searchStore);
    if (searchStore.length > 4) {
        searchStore.pop();
    }
}

// create last searched max of 5, if clicked updated cards
// remove last from list

searchButton.on("click", getForecast)

