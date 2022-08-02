import utils from './utils';

export default {
  quotesData: [],
  lastQuoteIdx: -1,

  getRandomQuote() {
    let idx;
    do {
      idx = utils.getRandomNum(0, this.quotesData.length - 1);
    } while (idx === this.lastQuoteIdx);
    this.lastQuoteIdx = idx;
    return this.quotesData[idx];
  },

  async loadQuotes(lang = 'en') {
    const quotes = `./assets/quotes-${lang}.json`;
    const res = await fetch(quotes);
    const data = await res.json();

    this.lastQuoteIdx = -1;
    this.quotesData = data;
    return data;
  },
};
