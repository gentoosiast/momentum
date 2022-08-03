export default {
  async getWeather(city, lang = 'en') {
    const apiKey = '9b54f4afa357aa2fe016d645b4d732ec';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    /* eslint-disable */
    console.log('received data from api');
    /* eslint-enable */
    return data;
  },
};
