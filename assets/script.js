// vars
const searchButton = $("#search");


const api = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "&units=metric&appid=dafe53ce7645ef5b27a79562190e601b";

// store search
function getForecast(event) {
    event.preventDefault()
    let city = $(event.target).parents().find("input").val().toLowerCase()
    searchApi = api + city + apiKey

    fetch(searchApi)
        .then(function (response) {
            if (response.ok) {
                createCards(response.json())
            } else {
                alert("No result found for " + city)
            }
        })
}

// create cards and set attributes
function createCards(data) {
    console.log(data)

    for (let i = 0; i < data.length; i++) {



    }



}
// append to cards / div




// save search function local storage
// create last searched max of 5, if clicked updated cards
// remove last from list

searchButton.on("click", getForecast)

