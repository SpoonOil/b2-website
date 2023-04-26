let place = 1;

const navMenu = document.querySelector(".toolList");

const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function updateSeasonInfo() {
    fetch('https://data.ninjakiwi.com/battles2/homs')
        .then((response) => response.json())
        .then((json) => updateAll(json))
}

function updateAll(json) {
    getLeaderboardInfo(json.body[1].leaderboard);
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
        playerRow.classList.add('playerRow');
        let playerName = document.createElement('td');
        playerName.classList.add('playerName');
        let playerScore = document.createElement('td');
        playerScore.classList.add('playerScore');
        let playerPlace = document.createElement('td');
        if (place < 4) {
            playerPlace.classList.add(`place${place}`);
            playerRow.classList.add('firstPlace');
        }
        playerPlace.textContent = place;
        place++;
        playerScore.textContent = player.score;
        playerName.textContent = player.displayName;
        playerRow.appendChild(playerName);
        playerRow.appendChild(playerScore);
        playerRow.appendChild(playerPlace);
        playerRow.dataset.profileURL = player.profile;
        playerRow.classList.add('playerRow');
        playerRow.addEventListener('click', () => {
            window.open('../playerInfo/playerInfo.html?' + playerRow.dataset.profileURL, '_self');
        });
        document.querySelector('.leaderboard>tbody').appendChild(playerRow);
    }
}
