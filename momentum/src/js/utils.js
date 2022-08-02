export default {
  getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  setBg(elem, url) {
    const targetElement = elem;
    const img = new Image();
    img.src = url;
    img.addEventListener('load', () => {
      targetElement.style.backgroundImage = `url('${img.src}')`;
    });
  },
};
