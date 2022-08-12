import state from './state';
import utils from './utils';

let quotesData = [];
let lastQuoteIdx = -1;

const quoteText = document.querySelector('.quote-widget__text');
const quoteAuthor = document.querySelector('.quote-widget__author');
const quoteButton = document.querySelector('.quote-widget__reload');

async function fetchQuotes(lang = 'en') {
  const quotes = `./assets/quotes-${lang}.json`;
  const res = await fetch(quotes);
  const data = await res.json();

  return data;
}

function update() {
  let idx;
  do {
    idx = utils.getRandomNum(0, quotesData.length - 1);
  } while (idx === lastQuoteIdx);
  lastQuoteIdx = idx;
  const quote = quotesData[idx];
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = quote.author;
}

quoteButton.addEventListener('click', update);

export default {
  update,
  init() {
    const lang = utils.getCountryCode(state.get('locale'));
    fetchQuotes(lang)
      .then((data) => {
        quotesData = data;
        this.update();
      })
      .catch((e) => {
        utils.showError(`quotes widget: ${e}`);
      });
  },
};
