import i18n from '../assets/i18n.json';
import datetime from './datetime';

function get(key) {
  const defaultSettings = {
    userName: '',
    locale: 'ru-RU',
    imageProvider: 'github',
    weatherLastRequest: 0,
    tasks: [],
    widgets: {
      clock: true,
      calendar: true,
      greeting: true,
      quote: true,
      weather: true,
      audio: true,
      tasklist: true,
    },
  };

  let val = JSON.parse(localStorage.getItem(key));

  if (!val) {
    if (key === 'city') {
      val = i18n[get('locale')].weather.defaultCity;
    } else if (key === 'imageTags') {
      val = [datetime.getTimeOfDay()];
    } else {
      val = defaultSettings[key];
    }
  }
  return val;
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default {
  get,
  set,
};
