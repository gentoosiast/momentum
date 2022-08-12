import datetime from './datetime';
import utils from './utils';

export default {
  idx: utils.getRandomNum(1, 20),

  getImage() {
    const date = new Date();
    const timeOfDay = datetime.getTimeOfDay(date);
    const imgNum = this.idx.toString().padStart(2, '0');
    const url = `https://raw.githubusercontent.com/gentoosiast/momentum-backgrounds/main/${timeOfDay}/${imgNum}.webp`;

    return Promise.resolve(url);
  },

  prev() {
    this.idx = this.idx === 1 ? 20 : this.idx - 1;
    return this.getImage();
  },

  next() {
    this.idx = this.idx === 20 ? 1 : this.idx + 1;
    return this.getImage();
  },
};
