import ApiUtilities from "./utilities.js";

//grab nodes
const notificationSection = document.querySelector('.notificationSection');
const seasonTitle = document.querySelector('.seasonTitle');
const seasonLeaderboardTitle = document.querySelector('.seasonLeaderboardTitle');
const seasonTimeLeft = document.querySelector('.seasonTimeLeft');
const startDate = document.querySelector('.startDate');
const endDate = document.querySelector('.endDate');
const playerCount = document.querySelector('.playerCount');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.toolList');

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
    const leaderboardData = ApiUtilities.getActiveLeaderboard(json.body);
    console.log(leaderboardData)
    // Display no live season popup if there is no live season on the api
    !leaderboardData.liveLbExists ? seasonNotLivePopup(leaderboardData.activelb.name) : null
    getLeaderboardInfo(leaderboardData.activelb.leaderboard);
    setInterval(updateText, 100, leaderboardData.activelb);
    updateSeasonTitle(leaderboardData.activelb);
}

function getLeaderboardInfo(url) {
    fetch(url)
        .then((response) => response.json())
        .then((json) => createLeaderboard(json))
}

function seasonNotLivePopup(replacementSeasonName) {
    let notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification');
    let notificationText = document.createElement('p');
    notificationText.textContent = 
        `Note: there's currently no active leaderboard on Ninja Kiwi's API! For now, here's ${replacementSeasonName}!`
    notificationContainer.appendChild(notificationText);
    notificationSection.appendChild(notificationContainer);
}

function createLeaderboard(json) {
    const leaderboardBody = document.querySelector('.leaderboard>tbody');
    leaderboardBody.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        let player = json.body[i];
        let playerRow = document.createElement('tr');
        playerRow.classList.add('playerRow');
        let playerName = document.createElement('td');
        playerName.classList.add('playerName');
        let playerScore = document.createElement('td');
        playerScore.classList.add('playerScore');
        let playerPlace = document.createElement('td');
        if (i+1 < 4) {
            playerPlace.classList.add(`place${i+1}`);
            playerRow.classList.add('firstPlace');
        }
        playerPlace.classList.add('playerPlace');
        playerPlace.textContent = i+1;
        playerScore.textContent = player.score;
        playerName.textContent = player.displayName;
        playerRow.appendChild(playerName);
        playerRow.appendChild(playerScore);
        playerRow.appendChild(playerPlace);
        playerRow.dataset.profileURL = player.profile;
        playerRow.classList.add('playerRow');
        playerRow.addEventListener('click', () => {
            window.location.href ='playerInfo/playerInfo.html?' + playerRow.dataset.profileURL;
        });
        leaderboardBody.appendChild(playerRow);
    }
}

function updateText(data) {
    seasonTitle.textContent = data.name
    let timeLeft = getTimeLeft(data);
    seasonTimeLeft.innerHTML = `<b>Time Left:</b> ${timeLeft.days} Days, ${timeLeft.hours} Hours, ${timeLeft.minutes} Minutes`
    const seasonStart = new Date(data.start)
    const seasonEnd = new Date(data.end)
    startDate.textContent = seasonStart.toLocaleString()
    endDate.textContent = seasonEnd.toLocaleString()
    playerCount.textContent = data.totalScores
}

function updateSeasonTitle(data) {
    seasonLeaderboardTitle.textContent = data.name
}

function getTimeLeft(data) {
    const todayDate = new Date()
    // console.log(todayDate.toLocaleDateString());
    let endDate = new Date(data.end);
    // console.log(endDate.toLocaleDateString());
    let timeToEnd = (endDate - todayDate) /1000
    timeToEnd/=60 //seconds to minutes
    timeToEnd/=60 //minutes to hours
    let daysLeft = timeToEnd / 24 //hours to days
    daysLeft = Math.floor(daysLeft)
    let hoursLeft = timeToEnd % 24 //take remainder hours
    let minutesLeft = (hoursLeft*60)%60;
    minutesLeft = Math.floor(minutesLeft)
    hoursLeft = Math.floor(hoursLeft)
    // console.log(daysLeft, hoursLeft, minutesLeft);
    return {days : daysLeft, hours : hoursLeft, minutes : minutesLeft}
}
updateSeasonInfo();
