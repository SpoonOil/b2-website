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
    updateLastMatch(player)
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
    // console.log(seasons);
    if (seasons[0].rank) {
        let currentRank = seasons[0].rank;
        let currentScore = seasons[0].score;
        let currentTotal = seasons[0].totalScores;
        let currentRankDisplay = document.querySelector('.currentRank');
        currentRankDisplay.classList.add('currentRankDisplay');
        let currentRankNum = document.createElement('span');
        currentRankNum.classList.add('currentRankNum');
        let currentScoreNum = document.createElement('p');
        currentScoreNum.classList.add('currentScoreNum');
        let currentTotalNum = document.createElement('span');
        currentTotalNum.classList.add('currentTotalNum');
        currentScoreNum.textContent = `Score: ${currentScore}`;
        currentRankNum.textContent = currentRank;
        currentTotalNum.textContent = ` of ${currentTotal}`;
        currentRankDisplay.appendChild(currentRankNum);
        currentRankDisplay.appendChild(currentTotalNum);
        currentRankDisplay.appendChild(currentScoreNum);
    }
    if (seasons[1].rank) {
          let previousRank = seasons[1].rank;
          let previousScore = seasons[1].score;
          let previousTotal = seasons[1].totalScores;
          let previousRankDisplay = document.querySelector('.previousRank');
          previousRankDisplay.classList.add('previousRankDisplay');
          let previousRankNum = document.createElement('span');
          previousRankNum.classList.add('previousRankNum');
          let previousScoreNum = document.createElement('p');
          previousScoreNum.classList.add('previousScoreNum');
          let previousTotalNum = document.createElement('span');
          previousTotalNum.classList.add('previousTotalNum');
          previousScoreNum.textContent = `Score: ${previousScore}`;
          previousRankNum.textContent = previousRank;
          previousTotalNum.textContent = ` of ${previousTotal}`;
          previousRankDisplay.appendChild(previousRankNum);
          previousRankDisplay.appendChild(previousTotalNum);
          previousRankDisplay.appendChild(previousScoreNum);
    }
  }
}

function updateMedals(player) {
  for (badge in player.badges_all) {
    badgeImage = document.createElement('img');
    badgeImage.classList.add('badgeImage');
    badgeImage.src = player.badges_all[badge].iconURL;
    let badgeDisplay = document.querySelector('.badgeDisplay');
    badgeDisplay.appendChild(badgeImage);
  }
}

function updateLastMatch(player) {
  fetch(player.matches)
    .then((response) => response.json())
    .then((json) => displayLastMatch(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  function displayLastMatch(json) {
    match = json.body[0];
    console.log(match);
    players = [match.playerLeft, match.playerRight];
    console.log(players);
    for (let i = 0; i<2; i++) {
      console.log(players[i]);
      if (players[i].currentUser && players[i].result == 'win') {
        document.querySelector('.lastMatchResult').textContent = 'Win';
      } else if (players[i].currentUser && players[i].result == 'lose') {
        document.querySelector('.lastMatchResult').textContent = 'Loss';
      }
    }
  }
}
window.onload = function () {
  // Call the fetchResults() function when the page loads
  // This will make the API call and display the results.
  // This function is defined at the bottom of this file.
  // 
  fetchResults();
}