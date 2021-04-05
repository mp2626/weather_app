// vars
const searchButton = $("#search");
const citySpan = $("#citySpan");
const cards = $("#cards");

const api = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "&units=metric&appid=dafe53ce7645ef5b27a79562190e601b";
const weatherIconApi = "http://openweathermap.org/img/w/";

// store search
function getForecast(event) {
    event.preventDefault();
    let city = $(event.target).parents().find("input").val().toLowerCase().trim();
    searchApi = api + city + apiKey;

    fetch(searchApi)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    createCards(data);
                })
            } else {
                alert("No result found for " + city)
            };
        })
}

// create cards and set attributes
function createCards(data) {

    let currentDate = '';
    let count = 0;
    console.log(currentDate);
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
            cardTemp = $('<h2>').text("Temp (c) " + temp);
            cardWind = $('<h2>').text("Wind:  " + wind);
            cardHumidity = $('<h2>').text("Humidity - " + humidity);
            // Build cards
            cardBody.append(cardBodyImg, cardTemp, cardWind, cardHumidity);
            newCardDiv.append(cardDate, cardBody);
            cards.append(newCardDiv);
            // Update date and count to prevent multiple cards being built
            currentDate = moment(data.list[i].dt_txt).format('DD-MM-YYYY')
            count++
        }
    }
}
// append to cards / div




// save search function local storage
// create last searched max of 5, if clicked updated cards
// remove last from list

searchButton.on("click", getForecast)

