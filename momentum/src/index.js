import state from './js/state';
import datetime from './js/datetime';
import i18n from './js/i18n';
import imagesGitHub from './js/images-github';
import utils from './js/utils';
import quotes from './js/quotes';

let settings;

const body = document.querySelector('body');
const clock = document.querySelector('.date-widget__clock');
const calendar = document.querySelector('.date-widget__calendar');
const greeting = document.querySelector('.greeting-text');
const greetingInput = document.querySelector('.greeting-name');
const chevronLeft = document.querySelector('.chevron-left');
const chevronRight = document.querySelector('.chevron-right');
const quoteText = document.querySelector('.quote__text');
const quoteAuthor = document.querySelector('.quote__author');
const quoteButton = document.querySelector('.quote__reload');

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

function prevImage() {
  utils.setBg(body, imagesGitHub.getBackgroundPrev());
}

function nextImage() {
  utils.setBg(body, imagesGitHub.getBackgroundNext());
}

chevronLeft.addEventListener('click', prevImage);
chevronRight.addEventListener('click', nextImage);

quoteButton.addEventListener('click', updateQuote);
