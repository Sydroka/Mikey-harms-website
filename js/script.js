console.log("Mikey Harms Website Loaded!");

///////////////////////////////////////////////////////////
// Set current year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

///////////////////////////////////////////////////////////
// Make mobile navigation work

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// Smooth scrolling animation

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const href = link.getAttribute("href");

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
// Sticky navigation

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
// Music Player Functionality

const trackItems = document.querySelectorAll(".track-item");
const musicPlayer = document.getElementById("musicPlayer");

trackItems.forEach((item) => {
  item.addEventListener("click", function () {
    const audioSrc = this.getAttribute("data-audio");

    // Remove playing class from all items
    trackItems.forEach((i) => i.classList.remove("playing"));

    // If clicking the same song that's playing, pause it
    if (musicPlayer.src.includes(audioSrc) && !musicPlayer.paused) {
      musicPlayer.pause();
    } else {
      // Load and play new song
      musicPlayer.src = audioSrc;
      musicPlayer.play();
      this.classList.add("playing");
    }
  });
});

// Remove playing class when audio ends
musicPlayer.addEventListener("ended", function () {
  trackItems.forEach((i) => i.classList.remove("playing"));
});

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
