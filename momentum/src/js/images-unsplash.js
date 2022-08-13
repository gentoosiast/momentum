import datetime from './datetime';
import state from './state';

async function fetchURLs(page = 1) {
  const clientId = 'pAzE9lFgSFFzzO0WP2r4tvpXFpSAlQ0tSESW5ZuDVZo';
  let tags = state.get('imageTags');
  if (tags.length === 0) {
    tags = [datetime.getTimeOfDay()];
  }
  const apiEndpoint = `https://api.unsplash.com/search/photos?client_id=${clientId}&orientation=landscape&query=${tags.join(
    '%20'
  )}&content_filter=high&page=${page}&per_page=30`;
  let urls = [];

  const res = await fetch(apiEndpoint, {
    headers: {
      'Accept-Version': 'v1',
    },
  });
  const data = await res.json();

  if (res.ok) {
    const screenWidth = globalThis.screen.width;
    urls = data.results.map((result) => `${result.urls.raw}&w=${screenWidth}`);
    sessionStorage.setItem('unsplashTags', JSON.stringify(tags));
    sessionStorage.setItem('unsplashURLs', JSON.stringify(urls));
    sessionStorage.setItem('unsplashPage', JSON.stringify(page));
  } else if (data.errors) {
    throw new Error(
      `images-unsplash: HTTP Response Code: ${
        res.status
      }\nError Message: ${data.errors.join('\n')}`
    );
  } else {
    throw new Error(`images-unsplash: HTTP Response Code: ${res.status}`);
  }
  return urls;
}

export default {
  page: JSON.parse(sessionStorage.getItem('unsplashPage')) ?? 1,
  urls: [],
  async getImage() {
    const tags = state.get('imageTags');
    const lastTags = JSON.parse(sessionStorage.getItem('unsplashTags')) ?? [];
    const tagsNotChanged =
      tags.length === lastTags.length &&
      lastTags.every((tag) => tags.includes(tag));
    if (this.urls.length === 0 || !tagsNotChanged) {
      const lastPage = JSON.parse(sessionStorage.getItem('unsplashPage')) ?? 1;
      if (!tagsNotChanged) {
        this.page = 1;
      }
      if (tagsNotChanged && lastPage === this.page) {
        this.urls = JSON.parse(sessionStorage.getItem('unsplashURLs'));
      } else {
        const urls = await fetchURLs(this.page);
        this.urls = urls;
      }
      this.page += 1;
    }
    return this.urls.shift();
  },

  prev() {
    return this.getImage();
  },

  next() {
    return this.getImage();
  },
};
