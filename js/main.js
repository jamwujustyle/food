document.addEventListener("DOMContentLoaded", function () {
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
});
