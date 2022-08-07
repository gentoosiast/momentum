import playlist from '../assets/playlist.json';
import utils from './utils';

const audio = new Audio();
let playIdx = 0; // current track index
let playlistItems;
const playlistWidget = document.querySelector('.audio-widget__playlist');
const seekBar = document.querySelector('.player__seekbar');
const seekBarProgress = document.querySelector('.seekbar__progress');
const seekBarTrackName = document.querySelector('.seekbar__trackname');
const playPauseBtn = document.querySelector('.player__play-pause');
const playDuration = document.querySelector('.player__duration');
const volumeButton = document.querySelector('.player__volume-button');
const volumeBar = document.querySelector('.player__volume-bar');

function pauseAudio() {
  const playlistButton = playlistItems[playIdx].querySelector(
    '.playlist__item_button'
  );
  playlistButton.classList.remove('pause-button');
  playlistButton.classList.add('play-button');
  playPauseBtn.classList.remove('pause-button');
  playPauseBtn.classList.add('play-button');
  audio.pause();
}

function playAudio() {
  const playlistButton = playlistItems[playIdx].querySelector(
    '.playlist__item_button'
  );
  playlistButton.classList.remove('play-button');
  playlistButton.classList.add('pause-button');
  playlistItems[playIdx].classList.add('playlist__item_active');
  seekBarTrackName.textContent = playlist[playIdx].title;
  playPauseBtn.classList.remove('play-button');
  playPauseBtn.classList.add('pause-button');
  playDuration.textContent = playlist[playIdx].duration;
  audio.src = playlist[playIdx].src;
  audio.play();
}

function playPause() {
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
}

function updatePlaylistScroll() {
  playlistWidget.scrollTop =
    playlistItems[playIdx].offsetTop -
    playlistWidget.offsetTop -
    playlistWidget.offsetHeight / 2;
}

function playNext() {
  const playlistButton = playlistItems[playIdx].querySelector(
    '.playlist__item_button'
  );
  playlistButton.classList.remove('pause-button');
  playlistButton.classList.add('play-button');
  playlistItems[playIdx].classList.remove('playlist__item_active');
  playIdx = playIdx === playlist.length - 1 ? 0 : playIdx + 1;
  updatePlaylistScroll();
  playAudio();
}

function playPrev() {
  const playlistButton = playlistItems[playIdx].querySelector(
    '.playlist__item_button'
  );
  playlistButton.classList.remove('pause-button');
  playlistButton.classList.add('play-button');
  playlistItems[playIdx].classList.remove('playlist__item_active');
  playIdx = playIdx === 0 ? playlist.length - 1 : playIdx - 1;
  updatePlaylistScroll();
  playAudio();
}

function handlePlaylistClick(target) {
  const clickedTrackIdx = Number(target.getAttribute('data-idx'));

  if (playIdx === clickedTrackIdx) {
    playPause();
  } else {
    const playlistButton = playlistItems[playIdx].querySelector(
      '.playlist__item_button'
    );
    playlistButton.classList.remove('pause-button');
    playlistButton.classList.add('play-button');
    playlistItems[playIdx].classList.remove('playlist__item_active');
    playIdx = clickedTrackIdx;
    playAudio();
  }
}

function updateVolumeIcon() {
  volumeButton.className = 'player__volume';
  const { volume } = audio;
  if (audio.muted) {
    volumeButton.classList.add('volume-mute-button');
  } else if (volume < 0.5) {
    volumeButton.classList.add('volume-low-button');
  } else {
    volumeButton.classList.add('volume-high-button');
  }
}

function toggleMute() {
  audio.muted = !audio.muted;
  updateVolumeIcon();
}

export default {
  initPlayer() {
    playlist.forEach((item, i) => {
      const li = document.createElement('li');
      li.classList.add('playlist__item');
      li.innerHTML = `<div class="playlist__item_title"><span class="playlist__item_button play-button"></span><span>${(
        i + 1
      )
        .toString()
        .padStart(2, '0')}. ${item.artist} - ${
        item.title
      }</span></div><span class="playlist__item_duration">${
        item.duration
      }</span>`;
      li.setAttribute('data-idx', i);
      li.setAttribute('data-src', item.src);
      playlistWidget.append(li);
    });

    playlistItems = document.querySelectorAll('.playlist__item');
    const prevTrack = document.querySelector('.player__prev');
    const nextTrack = document.querySelector('.player__next');
    const playingTime = document.querySelector('.player__time');

    audio.src = playlist[playIdx].src;
    playlistItems[playIdx].classList.add('playlist__item_active');
    seekBarTrackName.textContent = playlist[playIdx].title;
    playingTime.textContent = '00:00';
    playDuration.textContent = playlist[playIdx].duration;
    volumeBar.value = audio.volume;
    updateVolumeIcon();

    playlistWidget.addEventListener('click', (e) => {
      handlePlaylistClick(e.target);
    });

    audio.addEventListener('ended', playNext);

    audio.addEventListener('timeupdate', () => {
      playingTime.textContent = utils.secondsToHumanReadableDuration(
        audio.currentTime
      );
      seekBarProgress.style.width = `${
        (audio.currentTime / audio.duration) * 100
      }%`;
    });

    seekBar.addEventListener('click', (e) => {
      const seekBarWidth = seekBar.offsetWidth;
      const newSeekPos = (e.offsetX / seekBarWidth) * audio.duration;
      audio.currentTime = newSeekPos;
    });

    playPauseBtn.addEventListener('click', playPause);
    prevTrack.addEventListener('click', playPrev);
    nextTrack.addEventListener('click', playNext);

    audio.addEventListener('volumechange', updateVolumeIcon);

    volumeButton.addEventListener('click', toggleMute);
    volumeBar.addEventListener('input', () => {
      audio.volume = volumeBar.value;
    });
  },
};
