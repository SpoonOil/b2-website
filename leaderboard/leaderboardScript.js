let place = 1;
function updateSeasonInfo() {
    fetch('https://data.ninjakiwi.com/battles2/homs')
        .then((response) => response.json())
        .then((json) => updateAll(json))
}

function updateAll(json) {
    getLeaderboardInfo(json.body[0].leaderboard);
    updateText(json);
}

function getLeaderboardInfo(url) {
    fetch(url)
        .then((response) => response.json())
        .then((json) => createLeaderboard(json))
}
function createLeaderboard(json) {
    currentPage = json
    createLeaderboardPage(currentPage);
    if (currentPage.next) {
        getLeaderboardInfo(currentPage.next);
    }
}


updateSeasonInfo();

function createLeaderboardPage(json) {
    for (let i = 0; i < json.body.length; i++) {
        let player = json.body[i];
        let playerRow = document.createElement('tr');
        let playerName = document.createElement('td');
        let playerScore = document.createElement('td');
        let playerPlace = document.createElement('td');
        playerPlace.textContent = place;
        place++;
        playerScore.textContent = player.score;
        playerName.textContent = player.displayName;
        playerRow.appendChild(playerName);
        playerRow.appendChild(playerScore);
        playerRow.appendChild(playerPlace);
        playerRow.dataset.profile = player.profile;
        playerRow.classList.add('playerRow');
        playerRow.addEventListener('click', () => {
            window.open(playerRow.dataset.profile + "?pretty=true", '_blank');
        });
        document.querySelector('.leaderboard').appendChild(playerRow);
    }
}
