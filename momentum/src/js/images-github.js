import datetime from './datetime';
import utils from './utils';

export default {
  url: 'https://raw.githubusercontent.com/gentoosiast/momentum-backgrounds/main',
  randomIdx: utils.getRandomNum(1, 20),

  getBackgroundURL() {
    const date = new Date();
    const timeOfDay = datetime.getTimeOfDay(date);
    return `${this.url}/${timeOfDay}/${this.randomIdx
      .toString()
      .padStart(2, '0')}.webp`;
  },

  getBackgroundPrev() {
    this.randomIdx = this.randomIdx === 1 ? 20 : this.randomIdx - 1;
    return this.getBackgroundURL();
  },

  getBackgroundNext() {
    this.randomIdx = this.randomIdx === 20 ? 1 : this.randomIdx + 1;
    return this.getBackgroundURL();
  },
};
