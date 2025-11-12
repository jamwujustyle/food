document.addEventListener("DOMContentLoaded", function () {
  const isPages = window.location.pathname.includes("/pages/");
  const baseUrl = isPages ? ".." : ".";

  fetch(`${baseUrl}/header.html`)
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("afterbegin", data);
    });

  fetch(`${baseUrl}/footer.html`)
    .then((response) => response.text())
    .then((data) => {
      document.body.insertAdjacentHTML("beforeend", data);
    });
});
