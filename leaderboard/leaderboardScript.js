import ApiUtilities from "/utilities.js";

const navMenu = document.querySelector(".toolList");

const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

let selectedSeasonIndex = 0;
try {
  updateSeasonInfo();
} catch (error) {
  console.error(error);
  const selectSeasonContainer = document.querySelector('.selectSeasonWrapper')
  const leaderboardContainer = document.querySelector('.leaderboardContainer')
  selectSeasonContainer.innerHTML = '';
  leaderboardContainer.style.display = 'none';

  const errorTitle = document.createElement("h3");
  errorTitle.innerHTML = 'Something went wrong';
  const errorDescription = document.createElement("h5");
  errorDescription.innerHTML = `An unhandled error occurred. If this error persists, please report the issue in <a href="https://discord.gg/HCWZ329Uda">Spoonoil's Discord server</a>.`;
  selectSeasonContainer.append(errorTitle, errorDescription);
}

function updateSeasonInfo() {
  fetch("https://data.ninjakiwi.com/battles2/homs")
    .then((response) => response.json())
    .then((json) => updateAll(json));
}

function updateAll(json) {
  clearLeaderboard();
  navBarLoading();
  const activeLeaderboard = ApiUtilities.getActiveLeaderboard(json.body).activelb
  document.querySelector(".seasonTitle").textContent = activeLeaderboard.name;
  getLeaderboardInfo(
    activeLeaderboard.leaderboard,
    1,
    document.querySelector(".leaderboard"),
    json.body,
  );
}

function createNavBar(leaderboardList) {
  document.querySelector(".selectSeasonContainer").innerHTML = "";
  leaderboardList.forEach((leaderboard, index) => {
    if (leaderboard.totalScores !== 0) {
      addLeaderboardButton(leaderboardList, index, selectedSeasonIndex == index);
    }
  });
}

function navBarLoading() {
  const navbar = document.querySelector(".selectSeasonContainer");
  navbar.innerHTML = "";

  const loadingContainer = document.createElement("div");
  loadingContainer.classList.add("loadingContainer");

  const loadingText = document.createElement("p");
  loadingText.textContent = "Loading...";
  const ring = document.createElement("div");
  ring.classList.add("ring");

  loadingContainer.appendChild(loadingText);
  loadingContainer.appendChild(ring);

  navbar.appendChild(loadingContainer);
}

function addLeaderboardButton(leaderboardList, index, selected) {
  let leaderboardButton = document.createElement("button");
  leaderboardButton.classList.add("seasonButton");
  selected ? leaderboardButton.classList.add("seasonButtonSelected") : null;
  leaderboardButton.textContent = leaderboardList[index].name;

  if (window.innerWidth < 500) {
    leaderboardButton.textContent = leaderboardButton.textContent.split(" ")[1];
  }
  leaderboardButton.addEventListener("click", () => {
    selectedSeasonIndex = index;
    clearLeaderboard();
    navBarLoading();
    document.querySelector(".seasonTitle").textContent =
      leaderboardList[index].name;
    
      
    getLeaderboardInfo(
      leaderboardList[index].leaderboard,
      1,
      document.querySelector(".leaderboard"),
      leaderboardList,
    );
  });
  document
    .querySelector(".selectSeasonContainer")
    .appendChild(leaderboardButton);
}

function clearLeaderboard() {
  const output = document.querySelector(".leaderboard");
  output.innerHTML = "";

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  const player = document.createElement("th");
  player.textContent = "Player";
  const score = document.createElement("th");
  score.textContent = "Score";
  const place = document.createElement("th");
  place.textContent = "Placing";
  tr.appendChild(player);
  tr.appendChild(score);
  tr.appendChild(place);
  thead.appendChild(tr);
  output.appendChild(thead);

  const tbody = document.createElement("tbody");
  output.appendChild(tbody);
}

function getLeaderboardInfo(url, index, output, leaderboardList) {
  fetch(url)
    .then((response) => response.json())
    .then((json) => createLeaderboard(json, index, output, leaderboardList));
}

function createLeaderboard(json, index, output, leaderboardList) {
  let currentPage = json;
  let currentPlace = index;
  createLeaderboardPage(currentPage, currentPlace, output);
  if (currentPage.next) {
    getLeaderboardInfo(currentPage.next, index + 50, output, leaderboardList);
  } else {
    createNavBar(leaderboardList);
  }
}

function createLeaderboardPage(json, startingPlace, output) {
  let place = startingPlace;
  for (let i = 0; i < json.body.length; i++) {
    let player = json.body[i];
    let playerRow = document.createElement("tr");
    playerRow.classList.add("playerRow");
    let playerName = document.createElement("td");
    playerName.classList.add("playerName");
    let playerScore = document.createElement("td");
    playerScore.classList.add("playerScore");
    let playerPlace = document.createElement("td");
    if (place < 4) {
      playerPlace.classList.add(`place${place}`);
      playerRow.classList.add("firstPlace");
    }
    playerPlace.textContent = place;
    place++;
    playerScore.textContent = player.score;
    playerName.textContent = player.displayName;
    playerRow.appendChild(playerName);
    playerRow.appendChild(playerScore);
    playerRow.appendChild(playerPlace);
    playerRow.dataset.profileURL = player.profile;
    playerRow.classList.add("playerRow");
    playerRow.addEventListener("click", () => {
      window.open(
        "../playerInfo/playerInfo.html?" + playerRow.dataset.profileURL.split('/').at(-1),
        "_self",
      );
    });
    output.appendChild(playerRow);
  }
}

