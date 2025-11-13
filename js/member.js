document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const memberName = urlParams.get("name");

  if (memberName) {
    fetch("../data/team-data.json")
      .then((response) => response.json())
      .then((data) => {
        const member = data[memberName];
        if (member) {
          document.title = `${member.name} - Reflection`;
          document.getElementById("member-name").textContent = member.name;
          document.getElementById("member-role").textContent = member.role;
          document.getElementById("member-autobiography").textContent =
            member.autobiography;
          document.getElementById("member-key-learnings").textContent =
            member.reflection.keyLearnings;
          document.getElementById("member-motto").textContent =
            member.reflection.motto;
          document.getElementById("member-applying-themes").textContent =
            member.reflection.applyingThemes;
          document.getElementById("member-quote").textContent = member.quote;

          if (member.photo) {
            const photo = document.getElementById("member-photo");
            photo.src = `../photos/${member.photo}`;
            photo.alt = member.name;
          }
        }
      });
  }
});
