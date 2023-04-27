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
    s10Leaderboard = document.querySelector('.leaderboardS10')
    s11Leaderboard = document.querySelector('.leaderboardS11')
    s12Leaderboard = document.querySelector('.leaderboardS12')
    s13Leaderboard = document.querySelector('.leaderboardS13')
    s14Leaderboard = document.querySelector('.leaderboardS14')
    s15Leaderboard = document.querySelector('.leaderboardS15')
    getLeaderboardInfo(json.body[0].leaderboard, 1, s12Leaderboard);
    getLeaderboardInfo(json.body[1].leaderboard, 1, s11Leaderboard);
    getLeaderboardInfo(json.body[2].leaderboard, 1, s10Leaderboard);
}

function getLeaderboardInfo(url, index, output) {
    fetch(url)
        .then((response) => response.json())
        .then((json) => createLeaderboard(json, index, output))
}
function createLeaderboard(json, index, output) {
    currentPage = json
    currentPlace = index
    createLeaderboardPage(currentPage, currentPlace, output);
    if (currentPage.next) {
        getLeaderboardInfo(currentPage.next, index+50, output);
    }
}


updateSeasonInfo();

function createLeaderboardPage(json, startingPlace, output) {
    let place = startingPlace
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
        output.appendChild(playerRow);
    }
}
