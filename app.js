function WeatherViewModel() {
    var self = this;

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    self.latitude = ko.observable(23.777176);
    self.longitude = ko.observable(90.399452);
    self.numOfDays = ko.observable(7);
    self.location = ko.observable("");
    self.weatherData = ko.observableArray([]);

    self.getWeather = function() {
        var latitude = self.latitude();
        var longitude = self.longitude();
        var days = self.numOfDays();

        if (latitude && longitude) {
            var apiKey = 'f6a10bf988b547caad995502241303'; 
            var apiUrl = 'https://api.weatherapi.com/v1/forecast.json?key=' + apiKey + '&q=' + latitude + ',' + longitude + '&days=' + days;

            $.ajax({
                url: apiUrl,
                success: function(response) {
                    self.weatherData([]);
                    self.location("Location: " + response.location.name + ', ' + response.location.country);

                    for (var i = 0; i < response.forecast.forecastday.length; i++) {
                        var forecastDay = response.forecast.forecastday[i];
                        var date = new Date(forecastDay.date);
                        var weekdayName = weekdays[date.getDay()];
                        self.weatherData.push({
                            date: forecastDay.date,
                            weekday: weekdayName,
                            description: forecastDay.day.condition.text,
                            icon: forecastDay.day.condition.icon,
                            maxTemp: forecastDay.day.maxtemp_c,
                            minTemp: forecastDay.day.mintemp_c,
                            chanceOfRain: forecastDay.day.daily_chance_of_rain,
                            humidity: forecastDay.day.avghumidity,
                            temperature: forecastDay.day.avgtemp_c,
                            uvIndex: forecastDay.day.uv,
                            wind: forecastDay.day.maxwind_kph
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error fetching weather data:", error);
                }
            });
        } else {
            alert("Please enter latitude and longitude.");
        }
    };

    self.getWeather();
}

ko.applyBindings(new WeatherViewModel());
