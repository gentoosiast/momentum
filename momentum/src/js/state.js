export default {
  load() {
    return {
      locale: localStorage.getItem('locale') ?? 'en-US',
      userName: localStorage.getItem('userName'),
      city: localStorage.getItem('city') ?? 'Minsk',
      // 0 if not set
      weatherLastRequest: Number(localStorage.getItem('weatherLastRequest')),
    };
  },
};
