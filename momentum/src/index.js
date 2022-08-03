import state from './js/state';
import datetime from './js/datetime';
import i18n from './js/i18n';
import imagesGitHub from './js/images-github';
import utils from './js/utils';
import quotes from './js/quotes';
import weather from './js/weather';

let settings;

const body = document.querySelector('body');
const clock = document.querySelector('.date-widget__clock');
const calendar = document.querySelector('.date-widget__calendar');
const greeting = document.querySelector('.greeting-text');
const greetingInput = document.querySelector('.greeting-name');
const chevronLeft = document.querySelector('.chevron-left');
const chevronRight = document.querySelector('.chevron-right');
const weatherInput = document.querySelector('.weather-widget__input');
const weatherIcon = document.querySelector('.weather-widget__icon');
const weatherTemp = document.querySelector('.weather-widget__temp');
const weatherDesc = document.querySelector('.weather-widget__desc');
const weatherWind = document.querySelector('.weather-widget__wind');
const weatherHumidity = document.querySelector('.weather-widget__humidity');

function updateCalendar(date) {
  calendar.textContent = datetime.getDate(date, settings.locale);
}

function updateGreeting(date) {
  const timeOfDay = datetime.getTimeOfDay(date);
  greeting.textContent = `${i18n.getGreeting(timeOfDay, settings.locale)},`;
}

function updateClock(date) {
  const currentTime = datetime.getTime(date, settings.locale);
  clock.textContent = currentTime;
}

function pollEverySecond() {
  const date = new Date();

  updateClock(date);
  if (datetime.isMidnight(date)) {
    updateCalendar(date);
  }
  if (datetime.isNewDayPeriod(date)) {
    updateGreeting(date);
  }
}

function setGreetingPlaceholder() {
  greetingInput.placeholder = i18n.getNamePlaceholder(settings.locale);
}

function updateGreetingName(name) {
  settings.userName = name;
}

function updateQuote() {
  const quote = quotes.getRandomQuote();
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = quote.author;
}

function initQuotes(locale = 'en-US') {
  quotes
    .loadQuotes(utils.getCountryCode(locale))
    .then(() => {
      updateQuote();
    })
    .catch((e) => {
      quoteText.textContent = e;
      quoteAuthor.textContent = '';
    });
}

function updateWeatherWidget(result) {
  if (result.cod === '404' && result.message === 'city not found') {
    weatherIcon.className = 'weather-widget__icon owi';
    weatherTemp.textContent = '';
    weatherDesc.textContent = i18n.getWeatherLabel(
      settings.locale
    ).cityNotFound;
    weatherWind.textContent = '';
    weatherHumidity.textContent = '';
  } else {
    const { icon, description: desc } = result.weather[0];
    const temp = Math.round(result.main.temp);
    const windSpeed = Math.round(result.wind.speed);
    const { humidity } = result.main;

    weatherIcon.className = 'weather-widget__icon owi';
    weatherIcon.classList.add(`owi-${icon}`);
    weatherTemp.textContent = `${temp}°C`;
    weatherDesc.textContent = desc;
    weatherWind.textContent = `${
      i18n.getWeatherLabel(settings.locale).windSpeed
    }: ${windSpeed} ${i18n.getWeatherLabel(settings.locale).windSpeedUnits}`;
    weatherHumidity.textContent = `${
      i18n.getWeatherLabel(settings.locale).humidity
    }: ${humidity}%`;
  }
}

function updateWeather() {
  const interval = 1000 * 60 * 25; // 25 minutes
  if (
    settings.city !== sessionStorage.getItem('weatherCity') ||
    Date.now() > Number(sessionStorage.getItem('weatherLastRequest') + interval)
  ) {
    weather
      .getWeather(settings.city, utils.getCountryCode(settings.locale))
      .then((data) => {
        sessionStorage.setItem('weatherLastRequest', Date.now().toString());
        sessionStorage.setItem('weatherCity', settings.city);
        sessionStorage.setItem('weatherData', JSON.stringify(data));
        updateWeatherWidget(data);
      });
  } else {
    const data = JSON.parse(sessionStorage.getItem('weatherData'));
    updateWeatherWidget(data);
  }
}

function init() {
  const date = new Date();
  settings = state.load();
  setInterval(pollEverySecond, 1000);
  updateClock(date);
  updateCalendar(date);
  updateGreeting(date);
  setGreetingPlaceholder();
  updateGreetingName(settings.userName);
  initQuotes(settings.locale);
  utils.setBg(body, imagesGitHub.getBackgroundURL());
  weatherInput.value = settings.city;
  updateWeather();
}

globalThis.addEventListener('load', () => {
  init();
});

greetingInput.addEventListener('focus', () => {
  greetingInput.value = '';
});

greetingInput.addEventListener('blur', () => {
  const name = greetingInput.value;
  if (name) {
    updateGreetingName(name);
  } else {
    greetingInput.value = settings.userName;
  }
});

greetingInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    greetingInput.blur();
  } else if (e.key === 'Escape') {
    greetingInput.value = settings.userName;
    greetingInput.blur();
  }
});

weatherInput.addEventListener('focus', () => {
  weatherInput.value = '';
});

weatherInput.addEventListener('blur', () => {
  const city = weatherInput.value;
  if (city) {
    settings.city = city;
    localStorage.setItem('city', city);
    updateWeather();
  } else {
    weatherInput.value = settings.city;
  }
});

weatherInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    weatherInput.blur();
  } else if (e.key === 'Escape') {
    weatherInput.value = settings.city;
    weatherInput.blur();
  }
});

function prevImage() {
  utils.setBg(body, imagesGitHub.getBackgroundPrev());
}

function nextImage() {
  utils.setBg(body, imagesGitHub.getBackgroundNext());
}

chevronLeft.addEventListener('click', prevImage);
chevronRight.addEventListener('click', nextImage);

quoteButton.addEventListener('click', updateQuote);
