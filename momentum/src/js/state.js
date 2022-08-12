const defaultSettings = {
  userName: '',
  locale: 'ru-RU',
  imageProvider: 'github',
  imageTags: [],
  city: 'Minsk',
  weatherLastRequest: 0,
  tasks: [],
  widgets: [
    'clock',
    'calendar',
    'greeting',
    'quote',
    'weather',
    'audio',
    'tasklist',
  ],
};

export default {
  get(key) {
    return JSON.parse(localStorage.getItem(key)) ?? defaultSettings[key];
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};
