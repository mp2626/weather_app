// vars
const searchButton = $("#search");


const api = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "&units=metric&appid=dafe53ce7645ef5b27a79562190e601b";

// store search
function getForecast(event) {
    event.preventDefault()
    let city = $(event.target).parents().find("input").val().toLowerCase().trim()
    searchApi = api + city + apiKey

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
    // console.log(data);
    let currentDate = '';
    let count = 0;
    console.log(currentDate);
    console.log(data.list);

    for (let i = 0; i < data.list.length; i++) {
        // gather data in vars
        // date = data;
        if (currentDate !== moment(data.list[i].dt_txt).format('DD-MM-YYYY') && count <= 4) {
            date = moment(data.list[i].dt_txt).format('DD-MM-YYYY')
            console.log(date);
            temp = data.list[i].main.temp;
            console.log(temp)



            currentDate = moment(data.list[i].dt_txt).format('DD-MM-YYYY')
            count++
        }
        // build cards

        // assign data
    }



}
// append to cards / div




// save search function local storage
// create last searched max of 5, if clicked updated cards
// remove last from list

searchButton.on("click", getForecast)

