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

function fetchRecentActivity(username, callback) {
  Promise.all([
    fetch(`https://api.github.com/users/${username}/events/public`),
    fetch(`https://api.github.com/search/issues?q=author:${username}+is:issue`),
    fetch(`https://api.github.com/search/issues?q=author:${username}+is:pr`),
  ])
    .then(async ([eventsResponse, issuesResponse, prsResponse]) => {
      if (!eventsResponse.ok || !issuesResponse.ok || !prsResponse.ok) {
        throw new Error("Failed to fetch recent activity");
      }

      const events = await eventsResponse.json();
      const issues = await issuesResponse.json();
      const prs = await prsResponse.json();

      callback(null, { events, issues: issues.items, prs: prs.items });
    })
    .catch((error) => {
      callback(error, null);
    });
}

function displayRecentActivity(activity) {
  const activityList = document.getElementById("activity-list");
  activityList.innerHTML = "";

  // Display recent commits
  const commits = activity.events
    .filter((event) => event.type === "PushEvent")
    .slice(0, 5);
  commits.forEach((commit) => {
    const listItem = document.createElement("li");
    listItem.className = "p-2 bg-white border border-gray-300 rounded-md";
    listItem.innerText = `Commit: ${commit.repo.name}`;
    activityList.appendChild(listItem);
  });

  // Display recent issues
  const issues = activity.issues.slice(0, 5);
  issues.forEach((issue) => {
    const listItem = document.createElement("li");
    listItem.className = "p-2 bg-white border border-gray-300 rounded-md";
    listItem.innerText = `Issue: ${issue.title}`;
    activityList.appendChild(listItem);
  });

  // Display recent pull requests
  const prs = activity.prs.slice(0, 5);
  prs.forEach((pr) => {
    const listItem = document.createElement("li");
    listItem.className = "p-2 bg-white border border-gray-300 rounded-md";
    listItem.innerText = `Pull Request: ${pr.title}`;
    activityList.appendChild(listItem);
  });

  document.getElementById("activity-container").style.display = "block";
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
    listItem.className = "p-2 bg-white border border-gray-300 rounded-md";
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

  // Fetch and display recent activity
  fetchRecentActivity(username, (error, activity) => {
    if (error) {
      console.error(error);
    } else {
      displayRecentActivity(activity);
    }
  });
}
