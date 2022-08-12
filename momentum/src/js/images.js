import imagesGitHub from './images-github';
import imagesUnsplash from './images-unsplash';
import imagesFlickr from './images-flickr';
import state from './state';
import utils from './utils';

const providers = {
  github: imagesGitHub,
  unsplash: imagesUnsplash,
  flickr: imagesFlickr,
};

function setBg(dir = 'next') {
  let promiseURL = null;
  if (dir === 'next') {
    promiseURL = providers[state.get('imageProvider')].next();
  } else {
    promiseURL = providers[state.get('imageProvider')].prev();
  }

  promiseURL
    .then((url) => {
      utils.setBg(document.body, url);
    })
    .catch((e) => {
      utils.showError(`${state.get('imageProvider')}: ${e}`);
    });
}

export default {
  prev() {
    setBg('prev');
  },

  next() {
    setBg('next');
  },
};
