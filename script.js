import suras from "./surahsList.js";

let title = document.getElementById("title");
const artist = document.getElementById("artist");

const audio = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const durationEl = document.getElementById("duration");
const currentTimeEl = document.getElementById("current-time");
const playerContainer = document.querySelector(".player-container");
const reciterChanger = document.getElementById("change-reciter");
const recitersList = document.querySelector(".reciters-list");

const progress = document.getElementById("progress");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const playBtn = document.getElementById("play");
const mediaQuery = window.matchMedia(
  "(min-width: 320px) and (max-width: 850px)"
);

let reciterNumber = 1;

let res;

let surahNumber = 1;
let clickedSurah;

const getSurah = async function (surah) {
  clickedSurah = surah.target.innerText.split(" - ")[0];
  surahNumber = suras.find((s) => s.name === clickedSurah).number;
  const { name, arabicName } = suras[surahNumber - 1];
  title.textContent = `${name} - ${arabicName}`;
  const data = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/${surahNumber}`
  );

  res = await data.json();

  const ayatUrl = res.audio_file.audio_url;

  loadSurah(ayatUrl);
};
const clickedOnSurah = function () {
  playerContainer.classList.remove("hidden");
  surasContainer.classList.add("hidden");
};

const showListButton = document.getElementById("showListButton");
const surasContainer = document.getElementById("surasContainer");
const surasList = document.getElementById("surasList");

showListButton.addEventListener("click", () => {
  if (mediaQuery.matches) {
    playerContainer.classList.toggle("hidden");
    surasContainer.addEventListener("click", clickedOnSurah);
  }
  surasList.innerHTML = "";

  suras.forEach((sura) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${sura.name} - ${sura.arabicName}`;
    listItem.addEventListener("click", getSurah);
    surasList.appendChild(listItem);
  });

  surasContainer.classList.toggle("hidden");
});

// check is playing
let isPlaying = false;
// play
const playSurah = function () {
  isPlaying = true;
  playBtn.setAttribute("title", "pause");
  playBtn.classList.replace("fa-play", "fa-pause");
  audio.play();
};
const pauseSong = function () {
  isPlaying = false;
  playBtn.setAttribute("title", "play");
  playBtn.classList.replace("fa-pause", "fa-play");
  audio.pause();
};

//play or pause event listners
playBtn.addEventListener("click", () =>
  isPlaying ? pauseSong() : playSurah()
);

// previous song
const prevSong = async function () {
  surahNumber--;
  if (surahNumber <= 0) {
    surahNumber = suras.length;
  }
  const { name, arabicName } = suras[surahNumber - 1];
  title.textContent = `${name} - ${arabicName}`;
  const data = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/${surahNumber}`
  );

  const res = await data.json();

  const ayatUrl = res.audio_file.audio_url;

  loadSurah(ayatUrl);
  playSurah();
};

// Next song
const nextSong = async function () {
  if (surahNumber > suras.length - 1) {
    surahNumber = 0;
  }
  const { name, arabicName } = suras[surahNumber];
  title.textContent = `${name} - ${arabicName}`;
  const data = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/${
      surahNumber + 1
    }`
  );
  const res = await data.json();
  surahNumber++;

  const ayatUrl = res.audio_file.audio_url;

  loadSurah(ayatUrl);
  playSurah();
};
const loadSurah = function (song) {
  artist.textContent = clickedSurah;
  if (reciterNumber === 1) artist.textContent = "Abdul Basit 'Abd us-Samad";
  if (reciterNumber === 6) artist.textContent = "mahmoud khalil al hussary";
  if (reciterNumber === 9) artist.textContent = "muhammad siddiq al-minshawi";
  if (reciterNumber === 129) artist.textContent = "mahmoud ali elbanna";
  if (reciterNumber === 3) artist.textContent = "Abdur-Rahman as-Sudais";
  if (reciterNumber === 7) artist.textContent = "Mishary bin Rashid Alafasy";
  if (reciterNumber === 97) artist.textContent = "Yasser Al-Dosari";

  audio.src = song;
  playSurah();
};

//update Progress Bar & time
const updateProgressBar = function (e) {
  if (!isPlaying) return;
  const { duration, currentTime } = e.srcElement;
  // Update progress bar width
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  // Calculate display for duration
  let durationHours, durationMinutes, durationSeconds;
  if (isNaN(duration)) {
    durationHours = "--";
    durationMinutes = "--";
    durationSeconds = "--";
  } else {
    durationHours = Math.floor(duration / 3600);
    durationMinutes = Math.floor((duration % 3600) / 60);
    durationSeconds = Math.floor(duration % 60);
  }
  durationEl.textContent = `${durationHours}:${durationMinutes
    .toString()
    .padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;

  // Calculate display for current time
  const currentHours = Math.floor(currentTime / 3600);
  const currentMinutes = Math.floor((currentTime % 3600) / 60);
  const currentSeconds = Math.floor(currentTime % 60);
  currentTimeEl.textContent = `${currentHours}:${currentMinutes
    .toString()
    .padStart(2, "0")}:${currentSeconds.toString().padStart(2, "0")}`;
};

// Set Progress Bar
const setProgressBar = function (e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  audio.currentTime = (clickX / width) * duration;
  playSurah();
};

// Event listners
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);

const initalSurah = async function () {
  surahNumber = 1;
  const data = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/1`
  );
  res = await data.json();

  const ayatUrl = res.audio_file.audio_url;
  audio.currentTime = "0.00";
  progress.style.width = "0%";

  audio.src = ayatUrl;
};

// hide the suras container if clicked any where in the page
window.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("player-container") ||
    e.target.classList.contains("fas") ||
    e.target.classList.contains("fa-solid") ||
    e.target.id === "change-reciter" ||
    e.target.matches("#showListButton")
  )
    return;
  // if small screen, show the playerContainer
  else if (mediaQuery.matches) {
    playerContainer.classList.remove("hidden");
    surasContainer.classList.add("hidden");
    recitersList.classList.add("hidden");
  } else {
    surasContainer.classList.add("hidden");
  }
});

// toggle reciter list
reciterChanger.addEventListener("click", function () {
  if (mediaQuery.matches) playerContainer.classList.toggle("hidden");

  recitersList.classList.toggle("hidden");
});

// change the reciter
recitersList.addEventListener("change", function (e) {
  if (mediaQuery.matches) {
    playerContainer.classList.remove("hidden");
    recitersList.classList.add("hidden");
  }

  title.textContent = "Al-Fatiha - الفاتحة ";

  currentTimeEl.textContent = "0:00:00";
  durationEl.textContent = "0:00:00";
  pauseSong();
  if (e.target.value === "option1") {
    reciterNumber = 1;
    artist.textContent = "Abdul Basit 'Abd us-Samad";

    initalSurah();
  }
  if (e.target.value === "option2") {
    reciterNumber = 6;
    artist.textContent = "mahmoud khalil al hussary";

    initalSurah();
  }
  if (e.target.value === "option3") {
    reciterNumber = 9;
    artist.textContent = "muhammad siddiq al-minshawi";

    initalSurah();
  }
  if (e.target.value === "option4") {
    reciterNumber = 129;
    artist.textContent = "mahmoud ali elbanna";

    initalSurah();
  }
  if (e.target.value === "option5") {
    reciterNumber = 3;
    artist.textContent = "Abdur-Rahman as-Sudais";

    initalSurah();
  }
  if (e.target.value === "option6") {
    reciterNumber = 7;
    artist.textContent = "Mishary bin Rashid Alafasy";
    initalSurah();
  }
  if (e.target.value === "option7") {
    reciterNumber = 97;
    artist.textContent = "Yasser Al-Dosari";
    initalSurah();
  }
});
// on load
window.addEventListener("load", initalSurah);
