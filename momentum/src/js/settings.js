import i18n from '../assets/i18n.json';
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
    utils.hideWidget(widget);
  }
  state.set('widgets', widgets);
}

function localize() {
  const localeHeading = document.querySelector('.settings__heading_locale');
  const imageProviderHeading = document.querySelector(
    '.settings__heading_image-provider'
  );
  const imageTagsInput = document.querySelector('.settings__image-tags');
  const widgetsHeading = document.querySelector('.settings__heading_widgets');
  const clockWidgetLabel = document.querySelector(
    '.settings__widget-label_clock'
  );
  const calendarWidgetLabel = document.querySelector(
    '.settings__widget-label_calendar'
  );
  const greetingWidgetLabel = document.querySelector(
    '.settings__widget-label_greeting'
  );
  const quoteWidgetLabel = document.querySelector(
    '.settings__widget-label_quote'
  );
  const weatherWidgetLabel = document.querySelector(
    '.settings__widget-label_weather'
  );
  const audioWidgetLabel = document.querySelector(
    '.settings__widget-label_audio'
  );
  const tasklistWidgetLabel = document.querySelector(
    '.settings__widget-label_tasklist'
  );
  localeHeading.textContent = i18n[state.get('locale')].settings.localeLabel;
  imageProviderHeading.textContent =
    i18n[state.get('locale')].settings.imageProviderLabel;
  imageTagsInput.placeholder =
    i18n[state.get('locale')].settings.imageTagsPlaceholder;
  const tags = state.get('imageTags');
  if (tags.length > 0) {
    imageTagsInput.value = tags.join(' ');
  }
  widgetsHeading.textContent = i18n[state.get('locale')].settings.widgetsLabel;
  clockWidgetLabel.textContent = i18n[state.get('locale')].settings.clockLabel;
  calendarWidgetLabel.textContent =
    i18n[state.get('locale')].settings.calendarLabel;
  greetingWidgetLabel.textContent =
    i18n[state.get('locale')].settings.greetingLabel;
  quoteWidgetLabel.textContent = i18n[state.get('locale')].settings.qotdLabel;
  weatherWidgetLabel.textContent =
    i18n[state.get('locale')].settings.weatherLabel;
  audioWidgetLabel.textContent = i18n[state.get('locale')].settings.audioLabel;
  tasklistWidgetLabel.textContent =
    i18n[state.get('locale')].settings.tasklistLabel;
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
  /* eslint-disable */
  const radioBtn = e.target;
  console.log('change', radioBtn.value);
  changeLocale(radioBtn.value);
  /* eslint-enable */
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

settingsButton.addEventListener('click', () => {
  settingsPopup.classList.toggle('settings_visible');
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
