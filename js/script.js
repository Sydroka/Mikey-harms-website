///////////////////////////////////////////////////////////
// PAGE LOADER
///////////////////////////////////////////////////////////

// Hide loader when page is fully loaded
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.classList.add("fade-out");

  // Remove loader from DOM after fade out
  setTimeout(function () {
    loader.style.display = "none";
  }, 500);
});

console.log("Mikey Harms Website Loaded!");

///////////////////////////////////////////////////////////
// CURRENT YEAR
///////////////////////////////////////////////////////////

// Set current year in footer
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

///////////////////////////////////////////////////////////
// MOBILE NAVIGATION
///////////////////////////////////////////////////////////

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// SMOOTH SCROLLING
///////////////////////////////////////////////////////////

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = link.getAttribute("href");

    // Skip merch buttons - they're disabled for now
    if (link.classList.contains("merch-btn")) {
      e.preventDefault();
      return;
    }

    // Let external links (http/https) work normally
    if (href && (href.startsWith("http://") || href.startsWith("https://")))
      return;

    e.preventDefault();

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile navigation
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});

///////////////////////////////////////////////////////////
// HERO IMAGE CAROUSEL
///////////////////////////////////////////////////////////

const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
const arrowLeft = document.querySelector(".carousel-arrow-left");
const arrowRight = document.querySelector(".carousel-arrow-right");

let currentSlide = 0;
let autoSlideInterval;

function showSlide(index) {
  // Remove active class from all slides and dots
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Add active class to current slide and dot
  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

// Auto-scroll every 4 seconds
function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Arrow button events
arrowRight.addEventListener("click", () => {
  nextSlide();
  resetAutoSlide();
});

arrowLeft.addEventListener("click", () => {
  prevSlide();
  resetAutoSlide();
});

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
    resetAutoSlide();
  });
});

// Start auto-sliding when page loads
startAutoSlide();

///////////////////////////////////////////////////////////
// STICKY NAVIGATION
///////////////////////////////////////////////////////////

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  },
);
obs.observe(sectionHeroEl);

///////////////////////////////////////////////////////////
// CUSTOM AUDIO PLAYER
///////////////////////////////////////////////////////////

const audioPlayer = document.getElementById("audioPlayer");
const musicPlayer = document.getElementById("musicPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeBtn = document.getElementById("volumeBtn");
const volumeSlider = document.getElementById("volumeSlider");
const playerAlbumArt = document.getElementById("playerAlbumArt");
const playerTrackName = document.getElementById("playerTrackName");
const trackItems = document.querySelectorAll(".track-item");

let currentTrack = null;

// Format time helper (converts seconds to MM:SS)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Track item click - Load and play selected song
trackItems.forEach((item) => {
  item.addEventListener("click", function () {
    const audioSrc = this.getAttribute("data-audio");
    const imgSrc = this.querySelector("img").src;
    const trackName = this.querySelector("img").alt;

    // Remove playing class from all items
    trackItems.forEach((t) => t.classList.remove("playing"));

    // Add playing class to clicked item
    this.classList.add("playing");

    // Load and play track
    musicPlayer.src = audioSrc;
    playerAlbumArt.src = imgSrc;
    playerTrackName.textContent = trackName;

    audioPlayer.style.display = "block";
    musicPlayer.play();
    currentTrack = this;

    // Update play button icon
    playPauseBtn.querySelector("ion-icon").setAttribute("name", "pause");
  });
});

// Play/Pause button functionality
playPauseBtn.addEventListener("click", () => {
  if (musicPlayer.paused) {
    musicPlayer.play();
    playPauseBtn.querySelector("ion-icon").setAttribute("name", "pause");
  } else {
    musicPlayer.pause();
    playPauseBtn.querySelector("ion-icon").setAttribute("name", "play");
  }
});

// Update progress bar as song plays
musicPlayer.addEventListener("timeupdate", () => {
  const progress = (musicPlayer.currentTime / musicPlayer.duration) * 100;
  progressFill.style.width = `${progress}%`;
  currentTimeEl.textContent = formatTime(musicPlayer.currentTime);
});

// Update duration display when song loads
musicPlayer.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(musicPlayer.duration);
});

// Click on progress bar to seek to different time
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  musicPlayer.currentTime = percent * musicPlayer.duration;
});

// Volume slider control
volumeSlider.addEventListener("input", (e) => {
  musicPlayer.volume = e.target.value / 100;

  // Update volume icon based on volume level
  const volumeIcon = volumeBtn.querySelector("ion-icon");
  if (e.target.value == 0) {
    volumeIcon.setAttribute("name", "volume-mute");
  } else if (e.target.value < 50) {
    volumeIcon.setAttribute("name", "volume-low");
  } else {
    volumeIcon.setAttribute("name", "volume-high");
  }
});

// Volume button mute/unmute toggle
volumeBtn.addEventListener("click", () => {
  if (musicPlayer.volume > 0) {
    musicPlayer.volume = 0;
    volumeSlider.value = 0;
    volumeBtn.querySelector("ion-icon").setAttribute("name", "volume-mute");
  } else {
    musicPlayer.volume = 1;
    volumeSlider.value = 100;
    volumeBtn.querySelector("ion-icon").setAttribute("name", "volume-high");
  }
});

// When track ends, reset play button and remove playing class
musicPlayer.addEventListener("ended", () => {
  playPauseBtn.querySelector("ion-icon").setAttribute("name", "play");
  if (currentTrack) {
    currentTrack.classList.remove("playing");
  }
});

///////////////////////////////////////////////////////////
// BIO TOGGLE (MIKEY / BAND)
///////////////////////////////////////////////////////////

const bioToggleBtn = document.getElementById("bioToggleBtn");
const bioToggleBtn2 = document.getElementById("bioToggleBtn2");
const mikeyBio = document.getElementById("mikeyBio");
const bandBio = document.getElementById("bandBio");

let showingBand = false;

function toggleBio() {
  if (showingBand) {
    // Switch back to Mikey bio
    mikeyBio.style.display = "block";
    bandBio.style.display = "none";
    showingBand = false;
  } else {
    // Switch to Band bio
    mikeyBio.style.display = "none";
    bandBio.style.display = "block";
    showingBand = true;
  }
}

bioToggleBtn.addEventListener("click", toggleBio);
bioToggleBtn2.addEventListener("click", toggleBio);

///////////////////////////////////////////////////////////
// FLEXBOX GAP FIX FOR SAFARI
///////////////////////////////////////////////////////////

// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();
