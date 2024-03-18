/* eslint-disable no-undef */
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function WeatherCardViewModel(params) {
  const self = this;

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
  const self = this;

  self.latitude = ko.observable(23.777176).extend({
    required: true,
    number: true,
  });
  self.longitude = ko.observable(90.399452).extend({
    required: true,
    number: true,
  });
  self.numOfDays = ko.observable(7).extend({
    required: true,
    number: true,
    min: 1,
  });
  self.location = ko.observable('');
  self.weatherData = ko.observableArray([]);
  self.currentWeather = {
    time: ko.observable(),
    temperature: ko.observable(''),
    feels: ko.observable(),
    description: ko.observable(),
    icon: ko.observable(),
    wind: ko.observable(),
    gust: ko.observable(),
    humidity: ko.observable(),
  };

  self.getWeather = function () {
    const errors = ko.validation.group(self);
    if (errors().length > 0) {
      errors.showAllMessages();
      return;
    }

    const latitude = self.latitude();
    const longitude = self.longitude();
    const days = self.numOfDays();

    if (latitude && longitude) {
      const apiKey = 'f6a10bf988b547caad995502241303';
      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=${days}`;

      $.ajax({
        url: apiUrl,
        success(response) {
          self.mapCurrntWeather(response.current);

          self.weatherData([]);
          response.forecast.forecastday.forEach((forecastDay) => {
            const mappedData = ko.mapping.fromJS(forecastDay);
            self.weatherData.push(mappedData);
          });
          self.location(`Location: ${response.location.name}, ${response.location.country}`);
        },
        error(xhr, status, error) {
          console.error('Error fetching weather data:', error);
        },
      });
    }
  };

  self.mapCurrntWeather = function (response) {
    self.currentWeather.temperature(response.temp_c);
    self.currentWeather.time(response.last_updated.split(' ')[1]);
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
    element: 'weather-card-templete',
  },
});
