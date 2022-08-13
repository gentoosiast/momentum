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

  getCountryCode(locale = 'en-US') {
    return locale.slice(0, 2);
  },

  secondsToHumanReadableDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds - minutes * 60);
    return `${minutes.toString().padStart(2, '0')}:${remaining
      .toString()
      .padStart(2, '0')}`;
  },

  showError(err) {
    /* TODO: display it on the screen */
    /* eslint-disable */
    console.log(err);
    /* eslint-enable */
  },

  hideWidget(widget) {
    function removeWidthHeight() {
      widget.classList.add('dimensionless');
      widget.removeEventListener('transitionend', removeWidthHeight);
    }

    widget.classList.remove('visible');
    widget.addEventListener('transitionend', removeWidthHeight);
  },

  showWidget(widget) {
    widget.classList.remove('dimensionless');
    widget.classList.add('visible');
  },
};
