import datetime from './datetime';
import state from './state';

async function fetchURLs(page = 1) {
  const apiKey = '91b39c4b69ca7057beea648a69bead76';
  let tags = state.get('imageTags');
  if (tags.length === 0) {
    tags = [datetime.getTimeOfDay()];
  }
  const apiEndpoint = `https://www.flickr.com/services/rest/?api_key=${apiKey}&method=flickr.photos.search&tags=${tags.join(
    ','
  )}&tag_mode=all&sort=relevance&safe_search=1&content_type=1&media=photos&page=${page}&per_page=200&extras=url_h&format=json&nojsoncallback=1`;
  let urls = [];

  /* eslint-disable */
  console.log('flickr fetch', apiEndpoint);
  /* eslint-enable */

  const res = await fetch(apiEndpoint);

  if (res.ok) {
    const data = await res.json();

    if (data.stat === 'fail') {
      throw new Error(`images-flickr: ${data.message}`);
    }
    // urls = data.photos.photo.map((photo) => photo.url_h).filter((url) => url);
    urls = data.photos.photo
      .filter((photo) => photo.url_h && photo.width_h > photo.height_h * 1.3)
      .map((photo) => photo.url_h);
    /* eslint-disable */
    console.log('flickr urls', urls);
    sessionStorage.setItem('flickrTags', JSON.stringify(tags));
    sessionStorage.setItem('flickrURLs', JSON.stringify(urls));
    sessionStorage.setItem('flickrPage', JSON.stringify(page));
    /* eslint-enable */
  } else {
    throw new Error(`images-flickr: HTTP Response Code: ${res.status}`);
  }
  return urls;
}

export default {
  page: JSON.parse(sessionStorage.getItem('flickrPage')) ?? 1,
  urls: [],
  async getImage() {
    let tags = state.get('imageTags');
    const lastTags = JSON.parse(sessionStorage.getItem('flickrTags')) ?? [];
    const tagsNotChanged =
      tags.length === lastTags.length &&
      lastTags.every((tag) => tags.includes(tag));
    if (this.urls.length === 0 || !tagsNotChanged) {
      const lastPage = JSON.parse(sessionStorage.getItem('flickrPage')) ?? 1;
      if (tags.length === 0) {
        tags = [datetime.getTimeOfDay()];
      }
      if (!tagsNotChanged) {
        this.page = 1;
      }
      if (tagsNotChanged && lastPage === this.page) {
        /* eslint-disable */
        console.log('images-flickr: getting images from cache');
        /* eslint-enable */
        this.urls = JSON.parse(sessionStorage.getItem('flickrURLs'));
      } else {
        /* eslint-disable */
        console.log('images-flickr: making fetch request');
        /* eslint-enable */
        const urls = await fetchURLs(this.page);
        this.urls = urls;
      }
      this.page += 1;
    }
    /* eslint-disable */
    console.log('urls remaining', this.urls.length - 1);
    /* eslint-enable */
    return this.urls.shift();
  },

  prev() {
    return this.getImage();
  },

  next() {
    return this.getImage();
  },
};
