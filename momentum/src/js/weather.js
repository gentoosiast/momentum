import i18n from '../assets/i18n.json';
import state from './state';
import utils from './utils';

const weatherInput = document.querySelector('.weather-widget__input');
const weatherError = document.querySelector('.weather-widget__error');
const weatherIcon = document.querySelector('.weather-widget__icon');
const weatherTemp = document.querySelector('.weather-widget__temp');
const weatherDesc = document.querySelector('.weather-widget__desc');
const weatherWind = document.querySelector('.weather-widget__wind');
const weatherHumidity = document.querySelector('.weather-widget__humidity');

function updateWeatherWidget(result) {
  if (result.cod === '404' && result.message === 'city not found') {
    weatherError.textContent = i18n[state.get('locale')].weather.cityNotFound;
  } else {
    const { icon, description: desc } = result.weather[0];
    const temp = Math.round(result.main.temp);
    const windSpeed = Math.round(result.wind.speed);
    const { humidity } = result.main;

    weatherError.textContent = '';
    weatherIcon.className = 'weather-widget__icon owi';
    weatherIcon.classList.add(`owi-${icon}`);
    weatherTemp.textContent = `${temp}°C`;
    weatherDesc.textContent = desc;
    weatherWind.textContent = `${
      i18n[state.get('locale')].weather.windSpeed
    }: ${windSpeed} ${i18n[state.get('locale')].weather.windSpeedUnits}`;
    weatherHumidity.textContent = `${
      i18n[state.get('locale')].weather.humidity
    }: ${humidity}%`;
  }
}

async function getWeather(city = 'Minsk', lang = 'en') {
  const lastRequestCity = JSON.parse(
    sessionStorage.getItem('weatherLastRequestCity')
  );
  const lastRequestTime = JSON.parse(
    sessionStorage.getItem('weatherLastRequestTime')
  );
  const lastRequestLang = JSON.parse(
    sessionStorage.getItem('weatherLastRequestLang')
  );

  if (
    city === lastRequestCity &&
    lang === lastRequestLang &&
    Date.now() <= lastRequestTime + 1000 * 60 * 15
  ) {
    const data = JSON.parse(sessionStorage.getItem('weatherLastRequestData'));
    updateWeatherWidget(data);
  } else {
    const apiKey = '9b54f4afa357aa2fe016d645b4d732ec';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (res.ok || res.status === 404) {
      const data = await res.json();
      sessionStorage.setItem(
        'weatherLastRequestTime',
        JSON.stringify(Date.now())
      );
      sessionStorage.setItem('weatherLastRequestCity', JSON.stringify(city));
      sessionStorage.setItem('weatherLastRequestData', JSON.stringify(data));
      sessionStorage.setItem('weatherLastRequestLang', JSON.stringify(lang));
      updateWeatherWidget(data);
    } else {
      throw new Error(`weather-widget: HTTP error: ${res.status}`);
    }
  }
}

function update() {
  const city = state.get('city');
  const lang = utils.getCountryCode(state.get('locale'));
  try {
    getWeather(city, lang);
  } catch (e) {
    utils.showError(e);
  }
}

weatherInput.addEventListener('focus', () => {
  weatherInput.value = '';
});

weatherInput.addEventListener('blur', () => {
  const city = weatherInput.value;
  if (city) {
    state.set('city', city);
    update();
  } else {
    weatherInput.value = state.get('city');
  }
});

weatherInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    weatherInput.blur();
  } else if (e.key === 'Escape') {
    weatherInput.value = state.get('city');
    weatherInput.blur();
  }
});

export default {
  init() {
    weatherInput.value = state.get('city');
  },

  update,
};
