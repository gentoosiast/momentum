import datetime from './datetime';
import utils from './utils';

export default {
  url: 'https://raw.githubusercontent.com/gentoosiast/momentum-backgrounds/main',
  idx: utils.getRandomNum(1, 20),

  getBackgroundURL() {
    const date = new Date();
    const timeOfDay = datetime.getTimeOfDay(date);
    return `${this.url}/${timeOfDay}/${this.idx
      .toString()
      .padStart(2, '0')}.webp`;
  },

  getBackgroundPrev() {
    this.idx = this.idx === 1 ? 20 : this.idx - 1;
    return this.getBackgroundURL();
  },

  getBackgroundNext() {
    this.idx = this.idx === 20 ? 1 : this.idx + 1;
    return this.getBackgroundURL();
  },
};
