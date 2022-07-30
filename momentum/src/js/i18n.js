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
};
