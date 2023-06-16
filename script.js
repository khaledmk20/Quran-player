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

const suras = [
  { name: "Al-Fatiha", number: 1 },
  { name: "Al-Baqara", number: 2 },
  { name: "Aal 'Imran", number: 3 },
  { name: "An-Nisa'", number: 4 },
  { name: "Al-Ma'idah", number: 5 },
  { name: "Al-An'am", number: 6 },
  { name: "Al-A'raf", number: 7 },
  { name: "Al-Anfal", number: 8 },
  { name: "At-Tawbah", number: 9 },
  { name: "Yunus", number: 10 },
  { name: "Hud", number: 11 },
  { name: "Yusuf", number: 12 },
  { name: "Ar-Ra'd", number: 13 },
  { name: "Ibrahim", number: 14 },
  { name: "Al-Hijr", number: 15 },
  { name: "An-Nahl", number: 16 },
  { name: "Al-Isra'", number: 17 },
  { name: "Al-Kahf", number: 18 },
  { name: "Maryam", number: 19 },
  { name: "Ta-Ha", number: 20 },
  { name: "Al-Anbiya'", number: 21 },
  { name: "Al-Hajj", number: 22 },
  { name: "Al-Mu'minun", number: 23 },
  { name: "An-Nur", number: 24 },
  { name: "Al-Furqan", number: 25 },
  { name: "Ash-Shu'ara'", number: 26 },
  { name: "An-Naml", number: 27 },
  { name: "Al-Qasas", number: 28 },
  { name: "Al-Ankabut", number: 29 },
  { name: "Ar-Rum", number: 30 },
  { name: "Luqman", number: 31 },
  { name: "As-Sajdah", number: 32 },
  { name: "Al-Ahzab", number: 33 },
  { name: "Saba'", number: 34 },
  { name: "Fatir", number: 35 },
  { name: "Ya-Sin", number: 36 },
  { name: "As-Saffat", number: 37 },
  { name: "Sad", number: 38 },
  { name: "Az-Zumar", number: 39 },
  { name: "Ghafir", number: 40 },
  { name: "Fussilat", number: 41 },
  { name: "Ash-Shura", number: 42 },
  { name: "Az-Zukhruf", number: 43 },
  { name: "Ad-Dukhan", number: 44 },
  { name: "Al-Jathiyah", number: 45 },
  { name: "Al-Ahqaf", number: 46 },
  { name: "Muhammad", number: 47 },
  { name: "Al-Fath", number: 48 },
  { name: "Al-Hujurat", number: 49 },
  { name: "Qaf", number: 50 },
  { name: "Adh-Dhariyat", number: 51 },
  { name: "At-Tur", number: 52 },
  { name: "An-Najm", number: 53 },
  { name: "Al-Qamar", number: 54 },
  { name: "Ar-Rahman", number: 55 },
  { name: "Al-Waqi'ah", number: 56 },
  { name: "Al-Hadid", number: 57 },
  { name: "Al-Mujadilah", number: 58 },
  { name: "Al-Hashr", number: 59 },
  { name: "Al-Mumtahanah", number: 60 },
  { name: "As-Saff", number: 61 },
  { name: "Al-Jumu'ah", number: 62 },
  { name: "Al-Munafiqun", number: 63 },
  { name: "At-Taghabun", number: 64 },
  { name: "At-Talaq", number: 65 },
  { name: "At-Tahrim", number: 66 },
  { name: "Al-Mulk", number: 67 },
  { name: "Al-Qalam", number: 68 },
  { name: "Al-Haqqah", number: 69 },
  { name: "Al-Ma'arij", number: 70 },
  { name: "Nuh", number: 71 },
  { name: "Al-Jinn", number: 72 },
  { name: "Al-Muzzammil", number: 73 },
  { name: "Al-Muddaththir", number: 74 },
  { name: "Al-Qiyamah", number: 75 },
  { name: "Al-Insan", number: 76 },
  { name: "Al-Mursalat", number: 77 },
  { name: "An-Naba'", number: 78 },
  { name: "An-Nazi'at", number: 79 },
  { name: "Abasa", number: 80 },
  { name: "At-Takwir", number: 81 },
  { name: "Al-Infitar", number: 82 },
  { name: "Al-Mutaffifin", number: 83 },
  { name: "Al-Inshiqaq", number: 84 },
  { name: "Al-Buruj", number: 85 },
  { name: "At-Tariq", number: 86 },
  { name: "Al-A'la", number: 87 },
  { name: "Al-Ghashiyah", number: 88 },
  { name: "Al-Fajr", number: 89 },
  { name: "Al-Balad", number: 90 },
  { name: "Ash-Shams", number: 91 },
  { name: "Al-Lail", number: 92 },
  { name: "Ad-Duha", number: 93 },
  { name: "Ash-Sharh", number: 94 },
  { name: "At-Tin", number: 95 },
  { name: "Al-'Alaq", number: 96 },
  { name: "Al-Qadr", number: 97 },
  { name: "Al-Bayyinah", number: 98 },
  { name: "Az-Zalzalah", number: 99 },
  { name: "Al-'Adiyat", number: 100 },
  { name: "Al-Qari'ah", number: 101 },
  { name: "At-Takathur", number: 102 },
  { name: "Al-'Asr", number: 103 },
  { name: "Al-Humazah", number: 104 },
  { name: "Al-Fil", number: 105 },
  { name: "Quraysh", number: 106 },
  { name: "Al-Ma'un", number: 107 },
  { name: "Al-Kawthar", number: 108 },
  { name: "Al-Kafirun", number: 109 },
  { name: "An-Nasr", number: 110 },
  { name: "Al-Masad", number: 111 },
  { name: "Al-Ikhlas", number: 112 },
  { name: "Al-Falaq", number: 113 },
  { name: "An-Nas", number: 114 },
];
// Alhusary 6 elminshawy 9 , elbana 129
let surahName;
let sheikhName;
let reciterNumber = 1;

let res;
const initialAyat = 0;
let changName = false;

let surahNumber = 1;
let clickedSurah;

const getSurah = async function (surah) {
  clickedSurah = surah.target.innerText;
  surahNumber = suras.find((s) => s.name === clickedSurah).number;
  const { name } = suras[surahNumber - 1];
  title.textContent = name;
  const data = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/${surahNumber}`
  );

  res = await data.json();
  console.log(res);

  const ayatUrl = res.audio_file.audio_url;

  loadSong(ayatUrl);
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
    listItem.textContent = sura.name;
    listItem.addEventListener("click", getSurah);
    surasList.appendChild(listItem);
  });

  surasContainer.classList.toggle("hidden");
});

// check is playing
let isPlaying = false;
// play
const playSong = function () {
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
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

// current song

let songIndex = 0;
// Update Dom

// previous song
const prevSong = async function () {
  surahNumber--;
  if (surahNumber <= 0) {
    surahNumber = suras.length;
  }
  const { name } = suras[surahNumber - 1];
  title.textContent = name;
  const data = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/${surahNumber}`
  );

  const res = await data.json();

  const ayatUrl = res.audio_file.audio_url;

  loadSong(ayatUrl);
  playSong();
};

// Next song
const nextSong = async function () {
  if (surahNumber > suras.length - 1) {
    surahNumber = 0;
  }
  const { name } = suras[surahNumber];
  title.textContent = name;
  const data = await fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/${
      surahNumber + 1
    }`
  );
  const res = await data.json();
  surahNumber++;

  const ayatUrl = res.audio_file.audio_url;

  loadSong(ayatUrl);
  playSong();
};
const loadSong = function (song) {
  artist.textContent = clickedSurah;
  if (reciterNumber === 1) artist.textContent = "Abdul Basit 'Abd us-Samad";
  if (reciterNumber === 6) artist.textContent = "mahmoud khalil al hussary";
  if (reciterNumber === 9) artist.textContent = "muhammad siddiq al-minshawi";
  if (reciterNumber === 129) artist.textContent = "mahmoud ali elbanna";

  // could change laters
  audio.src = song;
  playSong();
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
  playSong();
};

// Event listners
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("ended", nextSong);
audio.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);

const initalSurah = async function () {
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

  title.textContent = "Al-Fatiha";

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
    artist.textContent = "mahmoud khalil al hussary ";

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
});
// on load
window.addEventListener("load", initalSurah);
