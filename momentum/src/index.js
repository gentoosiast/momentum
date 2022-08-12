import state from './js/state';
import settings from './js/settings';
import datetime from './js/datetime';
import calendar from './js/calendar';
import greeting from './js/greeting';
import images from './js/images';
import quotes from './js/quotes';
import audioWidget from './js/audio';
import tasklist from './js/tasklist';
import weather from './js/weather';

const clock = document.querySelector('.clock-widget__clock');
const chevronLeft = document.querySelector('.chevron-left');
const chevronRight = document.querySelector('.chevron-right');

function updateClock(date) {
  const currentTime = datetime.getTime(date, state.get('locale'));
  clock.textContent = currentTime;
}

function pollEverySecond() {
  const date = new Date();

  updateClock(date);

  const day = date.getDate().toString();
  if (day !== sessionStorage.getItem('day')) {
    sessionStorage.setItem('day', day);
    calendar.update(date);
  }

  const timeOfDay = datetime.getTimeOfDay(date);
  if (timeOfDay !== sessionStorage.getItem('timeOfDay')) {
    sessionStorage.setItem('timeOfDay', timeOfDay);
    greeting.setGreeting(date);
    if (state.get('imageProvider') === 'github') {
      images.next();
    }
  }
}

function init() {
  settings.init();
  const date = new Date();
  setInterval(pollEverySecond, 1000);
  setInterval(weather.update, 1000 * 60 * 30);
  updateClock(date);
  calendar.update(date);
  greeting.init();
  quotes.init();
  images.next();
  weather.init();
  weather.update();
  audioWidget.init();
  tasklist.init();
}

globalThis.addEventListener('load', () => {
  init();
});

chevronLeft.addEventListener('click', images.prev);
chevronRight.addEventListener('click', images.next);
