import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  onDisconnect,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiB96LIN28Wa2ef0uJjV8nFy4u7h-9skY",
  authDomain: "mikey-harms-website.firebaseapp.com",
  databaseURL: "https://mikey-harms-website-default-rtdb.firebaseio.com",
  projectId: "mikey-harms-website",
  storageBucket: "mikey-harms-website.firebasestorage.app",
  messagingSenderId: "359019811623",
  appId: "1:359019811623:web:87b7189fff0a27ea5a4f02",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

///////////////////////////////////////////////////////////
// PAGE LOADER
///////////////////////////////////////////////////////////

window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(function () {
      loader.style.display = "none";
    }, 500);
  }
});

console.log("Mikey Harms Website Loaded!");

///////////////////////////////////////////////////////////
// CURRENT YEAR
///////////////////////////////////////////////////////////

const yearEl = document.querySelector(".year");
if (yearEl) {
  const currentYear = new Date().getFullYear();
  yearEl.textContent = currentYear;
}

///////////////////////////////////////////////////////////
// MOBILE NAVIGATION
///////////////////////////////////////////////////////////

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

if (btnNavEl) {
  btnNavEl.addEventListener("click", function () {
    headerEl.classList.toggle("nav-open");
  });
}

///////////////////////////////////////////////////////////
// SMOOTH SCROLLING
///////////////////////////////////////////////////////////

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = link.getAttribute("href");

    if (link.classList.contains("merch-btn")) {
      e.preventDefault();
      return;
    }

    if (href && (href.startsWith("http://") || href.startsWith("https://")))
      return;

    e.preventDefault();

    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      if (sectionEl) sectionEl.scrollIntoView({ behavior: "smooth" });
    }

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
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));
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

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

if (arrowRight) {
  arrowRight.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });
}

if (arrowLeft) {
  arrowLeft.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
    resetAutoSlide();
  });
});

if (slides.length > 0) startAutoSlide();

///////////////////////////////////////////////////////////
// STICKY NAVIGATION
///////////////////////////////////////////////////////////

const sectionHeroEl = document.querySelector(".section-hero");

if (sectionHeroEl) {
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
}

///////////////////////////////////////////////////////////
// AUDIO PLAYER IS NOW HANDLED IN THE INLINE TRACKS SCRIPT
// (See the <script type="module"> block after the tracks
//  section in index.html — it loads tracks from Firebase
//  and wires up the player controls.)
///////////////////////////////////////////////////////////

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
    mikeyBio.style.display = "block";
    bandBio.style.display = "none";
    showingBand = false;
  } else {
    mikeyBio.style.display = "none";
    bandBio.style.display = "block";
    showingBand = true;
  }
}

if (bioToggleBtn) bioToggleBtn.addEventListener("click", toggleBio);
if (bioToggleBtn2) bioToggleBtn2.addEventListener("click", toggleBio);

///////////////////////////////////////////////////////////
// BIO CAROUSELS
///////////////////////////////////////////////////////////

function moveCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  const imgs = carousel.querySelectorAll(".bio-carousel-img");
  const allDots = carousel.querySelectorAll(".bio-dot");

  let current = [...imgs].findIndex((img) => img.classList.contains("active"));
  if (current === -1) return;

  let next = (current + direction + imgs.length) % imgs.length;

  imgs.forEach((img) => {
    img.style.zIndex = "1";
    img.style.opacity = "0";
    img.classList.remove("active");
  });
  allDots.forEach((dot) => dot.classList.remove("active"));

  imgs[current].style.zIndex = "2";
  imgs[current].style.opacity = "1";

  imgs[next].style.zIndex = "3";
  imgs[next].style.opacity = "0";
  imgs[next].classList.add("active");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      imgs[next].style.opacity = "1";
      allDots[next].classList.add("active");
    });
  });

  setTimeout(() => {
    imgs[current].style.opacity = "0";
    imgs[current].style.zIndex = "1";
  }, 1100);
}

window.moveCarousel = moveCarousel;

function autoAdvance(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  setInterval(() => moveCarousel(carouselId, 1), 5000);
}

autoAdvance("carouselLeft");
autoAdvance("carouselRight");

///////////////////////////////////////////////////////////
// FLEXBOX GAP FIX FOR SAFARI
///////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////
// LIVE SECTION
///////////////////////////////////////////////////////////

onValue(ref(db, "liveStatus"), (snapshot) => {
  const data = snapshot.val() || {};
  const isLive = data.isLive || false;

  const offlineDiv = document.getElementById("liveOffline");
  const activeDiv = document.getElementById("liveActive");

  if (!offlineDiv || !activeDiv) return;

  if (isLive) {
    offlineDiv.style.display = "none";
    activeDiv.style.display = "block";

    if (data.youtubeUrl) {
      const embedBox = document.getElementById("liveEmbedBox");
      const iframe = document.getElementById("youtubeEmbed");
      const videoId = extractYouTubeId(data.youtubeUrl);
      if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        embedBox.style.display = "block";
      }
    }

    const tiktokLink = document.getElementById("tiktokLiveLink");
    if (tiktokLink) tiktokLink.style.display = data.tiktok ? "flex" : "none";

    const instagramLink = document.getElementById("instagramLiveLink");
    if (instagramLink)
      instagramLink.style.display = data.instagram ? "flex" : "none";
  } else {
    offlineDiv.style.display = "block";
    activeDiv.style.display = "none";
  }
});

// Track visitor presence
const visitorRef = push(ref(db, "visitors"));
set(visitorRef, { active: true, timestamp: Date.now() });
onDisconnect(visitorRef).remove();

function extractYouTubeId(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}
