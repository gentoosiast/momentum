export default {
  getTime(date, locale = 'en-US') {
    // https://stackoverflow.com/questions/68646411/date-tolocalestringen-us-hour12-false-is-providing-midnight-as-24
    const options = { hourCycle: 'h23' }; // task requirements

    return date.toLocaleTimeString(locale, options);
  },

  getDate(date, locale = 'en-US') {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };

    return date.toLocaleDateString(locale, options);
  },

  getTimeOfDay(date) {
    const hours = date.getHours();
    if (hours >= 6 && hours <= 11) {
      return 'morning';
    }
    if (hours >= 12 && hours <= 17) {
      return 'afternoon';
    }
    if (hours >= 18 && hours <= 23) {
      return 'evening';
    }
    return 'night';
  },
};
