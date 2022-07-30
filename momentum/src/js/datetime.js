export default {
  getTime(locale = 'en-US') {
    const date = new Date();
    const options = { hour12: false }; // task requirements

    return date.toLocaleTimeString(locale, options);
  },

  getDate(locale = 'en-US') {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };

    return date.toLocaleDateString(locale, options);
  },

  getTimeOfDay() {
    const date = new Date();
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
