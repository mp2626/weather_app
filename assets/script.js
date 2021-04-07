// vars
const searchButton = $("#search");
const citySpan = $("#citySpan");
const cards = $("#cards");
const locationStore = $("#storedLocations");
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
    // checks for event target to gather city name from
    if (event.target.id == "search") {
        city = $(event.target).parents().find("input").val().toLowerCase().trim();
    } else {
        city = event.target.innerText;
    }

    // builds search for api call 
    searchApi = api + city + apiKey;
    $('#search-input').val('');

    // calls apis required to proved weather data and calls create card function once ready
    fetch(searchApi)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                alert("No result found")
            };
        })
        .then(data => {
            weatherData = data;
            if (data != null) {
                cityLat = data.city.coord.lat;
                cityLon = data.city.coord.lon;
                searchUvApi = apiUV + "lat=" + cityLat + "&lon=" + cityLon + apiKeyUv;
            } else {
                return
            }
            fetch(searchUvApi)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                })
                .then(data => {
                    uvData = data.value;
                    createCards(weatherData);
                });
        });
};

// create cards and set attributes
function createCards(data) {

    let currentDate = '';
    let count = 0;

    citySpan.text(" - " + data.city.name);

    // clears divs to reloads new cities divs 
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
    // adds uv to fist card as per requirements
    cardUv = $('<h2>').text('UV Index: ').addClass('uv');
    span = $('<span>').text(uvData).addClass('span');
    cardUv.append(span);
    $('.card').children().eq(1).append(cardUv);

    // sets span background uv rating based
    if (uvData <= 4) {
        $('.span').css('background-color', 'rgb(203, 236, 203)');
    } else if (uvData > 4 && uvData < 9) {
        $('.span').css('background-color', 'rgb(235, 176, 155)');
    } else {
        $('.span').css('background-color', 'rgb(231, 142, 142)');
    };

    // calls save data function
    saveData()
}

// save search function local storage
function saveData() {

    if (searchStore != null) {
        for (i = 0; i < searchStore.length; i++) {
            // prevents duplicates being added to stored searches if it already exists
            if (searchStore[i] == city) {
                return
            }
        } searchStore.unshift(city);
    } else {
        searchStore = [];
        searchStore.push(city);
    }
    // prevents the list length exceeding 5, removes last in list
    if (searchStore.length > 5) {
        searchStore.pop();
    }

    localStorage.setItem('locationSearch', JSON.stringify(searchStore));

    if ($('#storedLocations').children('button')) {
        $('#storedLocations').children().remove('button');
    }
    renderSavedLocations();
}

// renders saved searches
function renderSavedLocations() {
    searchStore = JSON.parse(localStorage.getItem('locationSearch'));

    if (searchStore != null) {
        for (let i = 0; i < searchStore.length; i++) {
            let newButton = $("#storedLocations");
            button = $('<button>').addClass('btn card btn-light col-5 col-md-3').attr('type', "submit").attr('id', "searchBtn").text(searchStore[i]);
            newButton.append(button);
        }
    }
}

// listens for clicks on search buttons or stored searches
searchButton.on("click", getForecast);
locationStore.on("click", getForecast);

// loads stored searches when the app is opened
renderSavedLocations()

