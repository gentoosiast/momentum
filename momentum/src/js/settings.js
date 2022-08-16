import i18n from '../assets/i18n.json';
import audio from './audio';
import calendar from './calendar';
import greeting from './greeting';
import images from './images';
import quotes from './quotes';
import state from './state';
import tasklist from './tasklist';
import utils from './utils';
import weather from './weather';

const settingsPopup = document.querySelector('.settings');
const settingsButton = document.querySelector('.settings-button');
const closeButton = document.querySelector('.settings__close');

const widgetCheckboxes = document.querySelectorAll(
  '.settings__widget-checkbox'
);

const localeRadioButtons = document.querySelectorAll(
  'input[name="settings__locale"'
);

const imageProviderButtons = document.querySelectorAll(
  'input[name="settings__image-provider"'
);

const localeFieldset = document.querySelector('.settings__fieldset_locale');
const imageProviderFieldset = document.querySelector(
  '.settings__fieldset_image-provider'
);
const tagsInput = document.querySelector('.settings__image-tags');

function toggleWidget(e) {
  const checkbox = e.target;
  const widgetName = checkbox.getAttribute('data-widget');
  const widget = document.querySelector(`.${widgetName}-widget`);
  const widgets = state.get('widgets');
  if (checkbox.checked) {
    widgets[widgetName] = true;
    utils.showWidget(widget);
  } else {
    widgets[widgetName] = false;
    if (widgetName === 'audio') {
      audio.pauseAudio();
    }
    utils.hideWidget(widget);
  }
  state.set('widgets', widgets);
}

function localize() {
  const settingsElems = settingsPopup.querySelectorAll('[data-i18n]');
  for (let i = 0; i < settingsElems.length; i += 1) {
    const el = settingsElems[i];
    const i18nAttr = el.getAttribute('data-i18n');
    if (i18nAttr) {
      const i18nElem = el;
      if (i18nAttr === 'imageTagsPlaceholder') {
        i18nElem.placeholder = i18n[state.get('locale')].settings[i18nAttr];
        const tags = JSON.parse(localStorage.getItem('imageTags'));
        if (tags) {
          i18nElem.value = tags.join(' ');
        }
      } else {
        i18nElem.textContent = i18n[state.get('locale')].settings[i18nAttr];
      }
    }
  }
}

function changeLocale(locale) {
  state.set('locale', locale);
  localize();
  calendar.update();
  greeting.localize();
  quotes.init();
  weather.update();
  tasklist.localize();
}

function changeImageProvider(provider) {
  state.set('imageProvider', provider);
  images.next();
}

localeFieldset.addEventListener('change', (e) => {
  const radioBtn = e.target;
  changeLocale(radioBtn.value);
});

imageProviderFieldset.addEventListener('change', (e) => {
  const radioBtn = e.target;
  changeImageProvider(radioBtn.value);
});

tagsInput.addEventListener('focus', () => {
  tagsInput.value = '';
});

tagsInput.addEventListener('blur', () => {
  const tags = tagsInput.value;
  if (tags) {
    state.set('imageTags', tags.split(' '));
    if (state.get('imageProvider') !== 'github') {
      images.next();
    }
  } else {
    tagsInput.value = state.get('imageTags').join(' ');
  }
});

tagsInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === 'NumpadEnter') {
    tagsInput.blur();
  } else if (e.key === 'Escape') {
    tagsInput.value = state.get('imageTags').join(' ');
    tagsInput.blur();
  }
});

closeButton.addEventListener('click', () => {
  settingsPopup.classList.remove('settings_visible');
});

function closeSettingsPopup(e) {
  if (!settingsPopup.contains(e.target)) {
    settingsPopup.classList.remove('settings_visible');
    document.removeEventListener('click', closeSettingsPopup);
  }
}

settingsButton.addEventListener('click', (e) => {
  if (settingsPopup.classList.contains('settings_visible')) {
    settingsPopup.classList.remove('settings_visible');
    document.removeEventListener('click', closeSettingsPopup);
  } else {
    settingsPopup.classList.add('settings_visible');
    document.addEventListener('click', closeSettingsPopup);
    e.stopPropagation();
  }
});

export default {
  init() {
    localize();
    const widgets = state.get('widgets');
    for (let i = 0; i < widgetCheckboxes.length; i += 1) {
      const checkbox = widgetCheckboxes[i];
      const widgetName = checkbox.getAttribute('data-widget');
      if (widgets[widgetName]) {
        checkbox.setAttribute('checked', '');
        const widget = document.querySelector(`.${widgetName}-widget`);
        utils.showWidget(widget);
      }
      checkbox.addEventListener('click', toggleWidget);
    }

    localeRadioButtons.forEach((localeBtn) => {
      if (localeBtn.value === state.get('locale')) {
        const btn = localeBtn;
        btn.checked = true;
      }
    });

    imageProviderButtons.forEach((imgProviderBtn) => {
      if (imgProviderBtn.value === state.get('imageProvider')) {
        const btn = imgProviderBtn;
        btn.checked = true;
      }
    });
  },
};
