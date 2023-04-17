const submit = document.querySelector('.submit');
const playerName = document.querySelector('.playerName');
const playerIcon = document.querySelector('.playerIcon');
const matchHistoryButton = document.querySelector('.matchHistory');




function fetchResults() {

  // Assemble the full URL
  let url = window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
  // Use fetch() to make the request to the API
  fetch(url)
    .then((response) => response.json())
    .then((json) => displayResults(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
}
function displayResults(json) {
    player = json.body;
    playerName.textContent = `${player.displayName}`;
    playerIcon.src = player.equippedAvatarURL;
    updateRankedStats(player);
    updateMedals(player);
    updateRankHistory(player);
    matchHistoryButton.addEventListener('click', () => {
      window.location.href = '../matchViewer/matches.html?' + player.matches;
    })
  };

function updateRankedStats(player) {
  for (const key in player.rankedStats) {
    // console.log(key);
    // console.log(player.rankedStats[key]);
    let keyRow = document.querySelector(`[data-key = ${key.toString()}]`);
    let dataOutput = document.querySelector(`[data-key = ${key.toString()}]>td:last-child`);
    // console.log(keyRow);
    dataOutput.textContent = player.rankedStats[key];
  }
}

function updateRankHistory(player) {
  fetch(player.homs)
    .then((response) => response.json())
    .then((json) => displayRankHistory(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  function  displayRankHistory(json) {
    seasons = json.body;
    console.log(seasons);
    currentRank = seasons[0].rank;
    previousRank = seasons[1].rank;
    let currentRankNum = document.createElement('span');
    currentRankNum.textContent = currentRank;
    let currentRankDisplay = document.querySelector('.currentRank');
    currentRankDisplay.appendChild(currentRankNum);
    let previousRankNum = document.createElement('span');
    previousRankNum.textContent = previousRank;
    let previousRankDisplay = document.querySelector('.previousRank');
    previousRankDisplay.appendChild(previousRankNum);
  }
}

function updateMedals(player) {
  for (badge in player.badges_all) {
    badgeImage = document.createElement('img');
    badgeImage.src = player.badges_all[badge].iconURL;
    let badgeDisplay = document.querySelector('.badgeDisplay');
    badgeDisplay.appendChild(badgeImage);
  }
}

window.onload = function () {
  // Call the fetchResults() function when the page loads
  // This will make the API call and display the results.
  // This function is defined at the bottom of this file.
  // 
  fetchResults();
}