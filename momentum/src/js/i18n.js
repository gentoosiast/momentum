export default {
  getGreeting(timeOfDay = 'morning', locale = 'en-US') {
    const greetings = {
      'en-US': {
        morning: 'Good morning',
        afternoon: 'Good afternoon',
        evening: 'Good evening',
        night: 'Good night',
      },
      'ru-RU': {
        morning: 'Доброе утро',
        afternoon: 'Добрый день',
        evening: 'Добрый вечер',
        night: 'Доброй ночи',
      },
    };
    return greetings[locale][timeOfDay];
  },

  getNamePlaceholder(locale = 'en-US') {
    const placeholder = {
      'en-US': 'Enter name',
      'ru-RU': 'Введите имя',
    };
    return placeholder[locale];
  },

  getWeatherLabel(locale = 'en-US') {
    const label = {
      'en-US': {
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        windSpeedUnits: 'm/s',
      },
      'ru-RU': {
        humidity: 'Влажность воздуха',
        windSpeed: 'Скорость ветра',
        windSpeedUnits: 'м/с',
      },
    };
    return label[locale];
  },
};
