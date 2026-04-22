import suras from "./surahsList.js";

/* ══════════════════════════════════════
   DOM References
══════════════════════════════════════ */
const titleEl       = document.getElementById("title");
const surahArabicEl = document.getElementById("surah-arabic");
const artistEl      = document.getElementById("artist");
const audio         = document.getElementById("audioUrl");
const progressFill  = document.getElementById("progress");
// The thumb follows the fill element via CSS (child of fill)
const progressWrap  = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl    = document.getElementById("duration");

const playBtn       = document.getElementById("play");
const playIcon      = document.getElementById("play-icon");
const prevBtn       = document.getElementById("prev");
const nextBtn       = document.getElementById("next");
const downloadBtn   = document.getElementById("download-btn");

const showListBtn   = document.getElementById("showListButton");
const sidebar       = document.getElementById("sidebar");
const sidebarClose  = document.getElementById("sidebar-close");
const surasList     = document.getElementById("surasList");
const surahSearch   = document.getElementById("surah-search");
const overlay       = document.getElementById("overlay");

const reciterBtn        = document.getElementById("change-reciter");
const reciterPanel      = document.getElementById("reciter-panel");
const reciterPanelClose = document.getElementById("reciter-panel-close");
const recitersListEl    = document.getElementById("reciters-list");

const artworkRing   = document.getElementById("artwork-ring");
const loadingBar    = document.getElementById("loading-bar");

/* ══════════════════════════════════════
   State
══════════════════════════════════════ */
let isPlaying    = false;
let surahNumber  = 1;
let reciterNumber = 1;
let currentAudioUrl = "";

const reciterNames = {
  1:   "Abdul Basit 'Abd us-Samad",
  6:   "Mahmoud Khalil Al-Hussary",
  9:   "Muhammad Siddiq Al-Minshawi",
  129: "Mahmoud Ali Al-Banna",
  3:   "Abdur-Rahman As-Sudais",
  7:   "Mishary Rashid Al-Afasy",
  97:  "Yasser Al-Dosari",
};

/* ══════════════════════════════════════
   Sidebar
══════════════════════════════════════ */
function openSidebar() {
  // Populate list when opening
  renderSurahsList(surahSearch.value);
  sidebar.classList.add("open");
  overlay.classList.add("visible");
  surahSearch.focus();
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
}

showListBtn.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
overlay.addEventListener("click", () => { closeSidebar(); closeReciterPanel(); });

function renderSurahsList(filter = "") {
  const q = filter.trim().toLowerCase();
  surasList.innerHTML = "";

  suras.forEach((sura) => {
    if (q && !sura.name.toLowerCase().includes(q) && !sura.arabicName.includes(q)) return;

    const li = document.createElement("li");
    li.dataset.number = sura.number;
    if (sura.number === surahNumber) li.classList.add("active");

    li.innerHTML = `
      <div class="surah-num">${sura.number}</div>
      <div class="surah-names">
        <span class="surah-name-en">${sura.name}</span>
        <span class="surah-name-ar">${sura.arabicName}</span>
      </div>
    `;

    li.addEventListener("click", () => selectSurah(sura.number));
    surasList.appendChild(li);
  });
}

surahSearch.addEventListener("input", () => renderSurahsList(surahSearch.value));

function highlightActiveSurah() {
  surasList.querySelectorAll("li").forEach((li) => {
    li.classList.toggle("active", parseInt(li.dataset.number) === surahNumber);
  });
}

/* ══════════════════════════════════════
   Reciter Panel
══════════════════════════════════════ */
function openReciterPanel() {
  reciterPanel.classList.add("open");
  overlay.classList.add("visible");
}

function closeReciterPanel() {
  reciterPanel.classList.remove("open");
  overlay.classList.remove("visible");
}

reciterBtn.addEventListener("click", openReciterPanel);
reciterPanelClose.addEventListener("click", closeReciterPanel);

recitersListEl.addEventListener("change", (e) => {
  const map = {
    option1: 1,
    option2: 6,
    option3: 9,
    option4: 129,
    option5: 3,
    option6: 7,
    option7: 97,
  };
  const val = e.target.value;
  reciterNumber = map[val];
  artistEl.textContent = reciterNames[reciterNumber];

  // Reset and reload current surah for new reciter
  pauseAudio();
  currentTimeEl.textContent = "0:00:00";
  durationEl.textContent    = "0:00:00";
  progressFill.style.width  = "0%";
  loadSurahByNumber(surahNumber);
  closeReciterPanel();
});

/* ══════════════════════════════════════
   Audio Controls
══════════════════════════════════════ */
function playAudio() {
  isPlaying = true;
  playIcon.classList.replace("fa-play", "fa-pause");
  playBtn.classList.add("playing");
  artworkRing.classList.add("playing");
  audio.play();
}

function pauseAudio() {
  isPlaying = false;
  playIcon.classList.replace("fa-pause", "fa-play");
  playBtn.classList.remove("playing");
  artworkRing.classList.remove("playing");
  audio.pause();
}

playBtn.addEventListener("click", () => {
  if (!audio.src || audio.src === window.location.href) return; // nothing loaded yet
  isPlaying ? pauseAudio() : playAudio();
});

prevBtn.addEventListener("click", async () => {
  surahNumber--;
  if (surahNumber < 1) surahNumber = suras.length;
  await loadSurahByNumber(surahNumber);
});

nextBtn.addEventListener("click", async () => {
  surahNumber++;
  if (surahNumber > suras.length) surahNumber = 1;
  await loadSurahByNumber(surahNumber);
});

audio.addEventListener("ended", async () => {
  surahNumber++;
  if (surahNumber > suras.length) surahNumber = 1;
  await loadSurahByNumber(surahNumber);
});

/* ══════════════════════════════════════
   Surah Selection
══════════════════════════════════════ */
async function selectSurah(number) {
  surahNumber = number;
  closeSidebar();
  await loadSurahByNumber(number);
}

async function loadSurahByNumber(number) {
  const sura = suras[number - 1];
  titleEl.textContent       = sura.name;
  surahArabicEl.textContent = sura.arabicName;
  artistEl.textContent      = reciterNames[reciterNumber];

  // Update progress UI
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "0:00:00";
  durationEl.textContent    = "0:00:00";

  showLoading(true);

  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/${number}`
    );
    const data = await response.json();
    currentAudioUrl = data.audio_file.audio_url;

    audio.src = currentAudioUrl;
    highlightActiveSurah();
    playAudio();
  } catch (err) {
    console.error("Failed to load surah:", err);
  } finally {
    showLoading(false);
  }
}

/* ══════════════════════════════════════
   Progress Bar
══════════════════════════════════════ */
audio.addEventListener("timeupdate", updateProgress);
progressWrap.addEventListener("click", seekAudio);

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const pct = duration ? (currentTime / duration) * 100 : 0;
  progressFill.style.width = `${pct}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  if (!isNaN(duration)) durationEl.textContent = formatTime(duration);
}

function seekAudio(e) {
  const width   = this.clientWidth;
  const clickX  = e.offsetX;
  const { duration } = audio;
  if (!duration) return;
  audio.currentTime = (clickX / width) * duration;
  if (!isPlaying) playAudio();
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ══════════════════════════════════════
   Download
══════════════════════════════════════ */
downloadBtn.addEventListener("click", () => {
  if (!currentAudioUrl) return;
  const filename = `${titleEl.textContent} - ${artistEl.textContent}.mp3`;
  downloadResource(currentAudioUrl, filename);
});

function downloadResource(url, filename) {
  if (!filename) filename = url.split("/").pop();
  fetch(url, {
    headers: new Headers({ Origin: location.origin }),
    mode: "cors",
  })
    .then((r) => r.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = filename;
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    })
    .catch((e) => console.error("Download error:", e));
}

/* ══════════════════════════════════════
   Loading indicator
══════════════════════════════════════ */
function showLoading(active) {
  loadingBar.classList.toggle("loading", active);
}

/* ══════════════════════════════════════
   Init
══════════════════════════════════════ */
async function init() {
  surahNumber = 1;
  artistEl.textContent = reciterNames[reciterNumber];
  showLoading(true);

  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/chapter_recitations/${reciterNumber}/1`
    );
    const data = await response.json();
    currentAudioUrl = data.audio_file.audio_url;
    audio.src = currentAudioUrl;
  } catch (err) {
    console.error("Failed to initialize:", err);
  } finally {
    showLoading(false);
  }
}

window.addEventListener("load", init);
