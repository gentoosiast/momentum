import i18n from '../assets/i18n.json';
import datetime from './datetime';
import state from './state';

const greeting = document.querySelector('.greeting-widget__text');
const greetingInput = document.querySelector('.greeting-widget__name');

function setName(name) {
  greetingInput.value = name;
}

greetingInput.addEventListener('focus', () => {
  setName('');
});

greetingInput.addEventListener('blur', () => {
  const name = greetingInput.value;
  if (name) {
    state.set('userName', name);
  } else {
    setName(state.get('userName'));
  }
});

greetingInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    greetingInput.blur();
  } else if (e.key === 'Escape') {
    setName(state.get('userName'));
    greetingInput.blur();
  }
});

export default {
  setGreeting(date = new Date()) {
    const timeOfDay = datetime.getTimeOfDay(date);
    greeting.textContent = `${i18n[state.get('locale')].greeting[timeOfDay]},`;
  },

  setPlaceholder() {
    greetingInput.placeholder = i18n[state.get('locale')].namePlaceholder;
  },

  init() {
    this.setPlaceholder();
    setName(state.get('userName'));
    this.setGreeting();
  },

  localize() {
    this.setPlaceholder();
    this.setGreeting();
  },
};
