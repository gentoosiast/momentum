import datetime from './datetime';
import state from './state';

const calendar = document.querySelector('.calendar-widget__calendar');

export default {
  update(date = new Date()) {
    calendar.textContent = datetime.getDate(date, state.get('locale'));
  },
};
