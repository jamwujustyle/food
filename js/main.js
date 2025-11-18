document.addEventListener("DOMContentLoaded", function () {
  // Flag rotation functionality with persistence
  const flags = [
    "un", // United Nations
    "uz", // Uzbekistan
    "us", // United States
    "gb", // United Kingdom
    "ca", // Canada
    "th", // Thailand
    "br", // Brazil
    "mx", // Mexico
    "fr", // France
    "de", // Germany
    "it", // Italy
    "es", // Spain
    "ru", // Russia
    "cn", // China
    "jp", // Japan
    "kr", // South Korea
    "in", // India
    "ae", // UAE
    "za", // South Africa
    "eg", // Egypt
    "au", // Australia
    "kz", // Kazakhstan
  ];

  const flagRotationInterval = 2500; // milliseconds
  let currentFlagIndex = 0;

  // Initialize or retrieve flag rotation start time
  if (!localStorage.getItem("flagRotationStartTime")) {
    localStorage.setItem("flagRotationStartTime", Date.now().toString());
  }

  // Calculate current flag index based on elapsed time
  function getCurrentFlagIndex() {
    const startTime = parseInt(localStorage.getItem("flagRotationStartTime"));
    const elapsedTime = Date.now() - startTime;
    const cyclesPassed = Math.floor(elapsedTime / flagRotationInterval);
    return cyclesPassed % flags.length;
  }

  // Calculate time until next flag change
  function getTimeUntilNextFlag() {
    const startTime = parseInt(localStorage.getItem("flagRotationStartTime"));
    const elapsedTime = Date.now() - startTime;
    const timeInCurrentCycle = elapsedTime % flagRotationInterval;
    return flagRotationInterval - timeInCurrentCycle;
  }

  function updateFlag() {
    const flagDisplay = document.getElementById("flag-display");
    if (flagDisplay) {
      // Add fade-out class
      flagDisplay.classList.add("fade-out");

      // Wait for fade-out animation to complete, then change flag and fade in
      setTimeout(() => {
        currentFlagIndex = getCurrentFlagIndex();

        // Remove all existing flag classes
        flagDisplay.className = flagDisplay.className
          .split(" ")
          .filter((c) => !c.startsWith("fi-"))
          .join(" ");

        // Add the new flag class
        flagDisplay.classList.add("fi", `fi-${flags[currentFlagIndex]}`);

        // Remove fade-out class to trigger fade-in
        flagDisplay.classList.remove("fade-out");
      }, 400); // Match CSS transition duration
    }
  }

  // Function to initialize flag rotation (called after header is loaded)
  function initializeFlagRotation() {
    currentFlagIndex = getCurrentFlagIndex();
    const flagDisplay = document.getElementById("flag-display");
    if (flagDisplay) {
      // Set initial flag
      flagDisplay.classList.add("fi", `fi-${flags[currentFlagIndex]}`);

      // Schedule the first update at the correct time
      const timeUntilNext = getTimeUntilNextFlag();
      setTimeout(() => {
        updateFlag();
        // Then continue regular rotation
        setInterval(updateFlag, flagRotationInterval);
      }, timeUntilNext);
    }
  }

  const isGitHubPages = window.location.hostname.includes("github.io");
  const basePath = isGitHubPages ? "/food" : "";

  // Function to rewrite links to work on GitHub Pages
  const rewriteLinks = (container) => {
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      // Only rewrite relative links that start with / and are not external protocol-relative links
      if (href && href.startsWith("/") && !href.startsWith("//")) {
        link.setAttribute("href", `${basePath}${href}`);
      }
    });
  };

  // Determine the base URL for fetching components based on current path
  const isPages = window.location.pathname.includes("/pages/");
  const fetchBaseUrl = isPages ? ".." : ".";

  // Fetch and inject header, then rewrite its links
  fetch(`${fetchBaseUrl}/header.html`)
    .then((response) => response.text())
    .then((data) => {
      // Use a temporary container to parse the HTML string
      const container = document.createElement("div");
      container.innerHTML = data;
      rewriteLinks(container);
      // Prepend all children of the container to the body
      while (container.firstChild) {
        document.body.prepend(container.firstChild);
      }

      // Highlight active navigation link
      const navLinks = document.querySelectorAll("nav ul a");
      const currentPage = window.location.pathname.endsWith("/")
        ? window.location.pathname + "index.html"
        : window.location.pathname;

      navLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname;
        if (currentPage.endsWith(linkPath)) {
          link.classList.add("active");
        }
      });

      // Initialize flag rotation after header is loaded
      initializeFlagRotation();
    });

  // Fetch and inject footer, then rewrite its links
  fetch(`${fetchBaseUrl}/footer.html`)
    .then((response) => response.text())
    .then((data) => {
      const container = document.createElement("div");
      container.innerHTML = data;
      rewriteLinks(container);
      // Append all children of the container to the body
      while (container.firstChild) {
        document.body.append(container.firstChild);
      }
    });

  // Scroll-reveal animation logic using Intersection Observer
  // Automatically add reveal class to common elements
  const elementsToReveal = document.querySelectorAll(
    "section, .hero, .about, .reflection-box, .quote-box, h1, h2, h3, p:not(footer p), .members li, .tags"
  );

  // Add reveal class to elements that don't already have it
  elementsToReveal.forEach((el) => {
    if (!el.classList.contains("reveal")) {
      el.classList.add("reveal");
    }
  });

  // Now observe all elements with the reveal class
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop observing after it's visible
        }
      });
    },
    {
      threshold: 0.15, // Trigger when 15% of the element is visible
      rootMargin: "0px 0px -50px 0px", // Start animation slightly before element enters viewport
    }
  );

  revealElements.forEach((el) => observer.observe(el));
});
