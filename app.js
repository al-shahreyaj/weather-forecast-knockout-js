const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function WeatherCardViewModel(params) {
    var self = this;

    self.date = params.value.date();
    self.description = params.value.day.condition.text();
    self.temperature = params.value.day.avgtemp_c();
    self.humidity = params.value.day.avghumidity();
    self.weekday = weekdays[new Date(params.value.date()).getDay()];
    self.icon = params.value.day.condition.icon();
    self.maxTemp = params.value.day.maxtemp_c();
    self.minTemp = params.value.day.mintemp_c();
    self.chanceOfRain = params.value.day.daily_chance_of_rain();
    self.uvIndex = params.value.day.uv();
    self.wind = params.value.day.maxwind_kph();
}


function WeatherViewModel() {
    var self = this;


    self.latitude = ko.observable(23.777176).extend({
        required: true,
        number: true
    });
    self.longitude = ko.observable(90.399452).extend({
        required: true,
        number: true
    });
    self.numOfDays = ko.observable(7).extend({
        required: true,
        number: true,
        min: 1
    });
    self.location = ko.observable("");
    self.weatherData = ko.observableArray([]);
    self.currentWeather = {
        time: ko.observable(),
        temperature: ko.observable(''),
        feels: ko.observable(),
        description: ko.observable(),
        icon: ko.observable(),
        wind: ko.observable(),
        gust: ko.observable(),
        humidity: ko.observable()
    }

    self.getWeather = function() {
        var errors = ko.validation.group(self);
        if (errors().length > 0) {
            errors.showAllMessages();
            return;
        }

        var latitude = self.latitude();
        var longitude = self.longitude();
        var days = self.numOfDays();

        if (latitude && longitude) {
            var apiKey = 'f6a10bf988b547caad995502241303';
            var apiUrl = 'https://api.weatherapi.com/v1/forecast.json?key=' + apiKey + '&q=' + latitude + ',' + longitude + '&days=' + days;

            $.ajax({
                url: apiUrl,
                success: function(response) {
                    self.mapCurrntWeather(response.current);

                    self.weatherData([]);
                    for (var i = 0; i < response.forecast.forecastday.length; i++) {
                        var forecastDay = response.forecast.forecastday[i];
                        var mappedData = ko.mapping.fromJS(forecastDay);
                        self.weatherData.push(mappedData);
                    }
                    self.location("Location: " + response.location.name + ', ' + response.location.country);

                },
                error: function(xhr, status, error) {
                    console.error("Error fetching weather data:", error);
                }
            });
        } else {
            alert("Please enter latitude and longitude.");
        }
    };
    
    self.mapCurrntWeather = function(response) {
        self.currentWeather.temperature(response.temp_c);
        self.currentWeather.time(response.last_updated.split(" ")[1]);
        self.currentWeather.feels(response.feelslike_c);
        self.currentWeather.description(response.condition.text);
        self.currentWeather.icon(response.condition.icon);
        self.currentWeather.wind(response.wind_kph);
        self.currentWeather.gust(response.gust_kph);
        self.currentWeather.humidity(response.humidity);
    };
    
    self.getWeather();
}

ko.applyBindings(new WeatherViewModel());

ko.components.register('weather-card', {
    viewModel: WeatherCardViewModel,
    template: {
        element: 'weather-card-templete'
    }
});