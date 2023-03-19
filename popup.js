document.getElementById("github-form").addEventListener("submit", (event) => {
  event.preventDefault();
  submitForm();
});

function fetchGithubData(username, callback) {
  fetch(`https://api.github.com/users/${username}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((error) => {
      callback(error, null);
    });
}

function fetchRepositories(username, page, perPage, callback) {
  fetch(
    `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      callback(null, data);
    })
    .catch((error) => {
      callback(error, null);
    });
}

function displayStats(data) {
  document.getElementById("username").innerText = data.login;
  document.getElementById("public_repos").innerText = data.public_repos;
  document.getElementById("followers").innerText = data.followers;
  document.getElementById("following").innerText = data.following;
  document.getElementById("last_updated").innerText = new Date(
    data.updated_at
  ).toLocaleDateString();
  document.getElementById("avatar").src = data.avatar_url;

  document.getElementById("stats-container").style.display = "block";
}

function displayRepositories(repositories) {
  const repositoriesList = document.getElementById("repositories-list");
  repositoriesList.innerHTML = ""; // Clear the previous list

  repositories.forEach((repo) => {
    const listItem = document.createElement("li");
    listItem.innerText = repo.name;
    repositoriesList.appendChild(listItem);
  });

  document.getElementById("repositories-container").style.display = "block";
}

function submitForm() {
  const username = document.getElementById("username-input").value;

  fetchGithubData(username, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      displayStats(data);
    }
  });

  // Fetch and display repositories
  fetchRepositories(username, 1, 10, (error, repositories) => {
    if (error) {
      console.error(error);
    } else {
      displayRepositories(repositories);
    }
  });
}
