document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit-button");
  const usernameInput = document.getElementById("username-input");
  const statsContainer = document.getElementById("stats-container");

  submitButton.addEventListener("click", function () {
    const username = usernameInput.value.trim();

    if (username) {
      const API_URL = `https://api.github.com/users/${username}`;

      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("username").textContent = data.login;
          document.getElementById("public_repos").textContent =
            data.public_repos;
          document.getElementById("followers").textContent = data.followers;
          document.getElementById("following").textContent = data.following;
          document.getElementById("last_updated").textContent = new Date(
            data.updated_at
          ).toLocaleString();

          statsContainer.style.display = "block";
        })
        .catch((error) => {
          console.error("Error fetching GitHub stats:", error);
        });
    }
  });
});
