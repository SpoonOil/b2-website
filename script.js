//grab nodes
const seasonTitle = document.querySelector('.seasonTitle');
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

function getLiveSeason(json) {
    // returns index of live season
    // returns -1 if off-season
    const liveIndex = json.body.findIndex(item => item.live === true);
    return liveIndex;
}

function getLatestPopulatedSeason(json) {
    const latestPopulatedIndex = json.body.findIndex(item => item.totalScores !== 0);
    return latestPopulatedIndex;
}

function updateSeasonInfo() {
    fetch('https://data.ninjakiwi.com/battles2/homs')
        .then((response) => response.json())
        .then((json) => updateAll(json))
}

function updateAll(json) {
    let liveSeasonIndex = getLiveSeason(json);
    // off season anti-break
    if (liveSeasonIndex === -1) liveSeasonIndex = getLatestPopulatedSeason(json)
    getLeaderboardInfo(json.body[liveSeasonIndex].leaderboard);
    updateText(json);
}

function getLeaderboardInfo(url) {
    fetch(url)
        .then((response) => response.json())
        .then((json) => createLeaderboard(json))
}

function createLeaderboard(json) {
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
        playerRow.appendChild(playerName);
        playerRow.appendChild(playerScore);
        playerRow.appendChild(playerPlace);
        console.log(playerRow);

        playerRow.dataset.profileURL = player.profile;
        playerRow.classList.add('playerRow');
        document.querySelector('.leaderboard>tbody').appendChild(playerRow);
        Array.from(playerRow.children).forEach(playerElement => {
            let playerElementLink = document.createElement('a');
            playerElementLink.classList.add('leaderboardLink');
            playerElementLink.href = 'playerInfo/playerInfo.html?' + playerRow.dataset.profileURL;
            playerElement.appendChild(playerElementLink);
        });
        playerPlace.firstChild.textContent = i+1;
        playerScore.firstChild.textContent = player.score;
        playerName.firstChild.textContent = player.displayName;
    }
}

function updateText(json) {
    let liveSeasonIndex = getLiveSeason(json)
    let isOffSeason;
    if (liveSeasonIndex === -1) {
        isOffSeason = true;
    } else {
        isOffSeason = false;
    }
    const latestPopulatedIndex = getLatestPopulatedSeason(json)
    timeLeft = getTimeLeft(json);
    seasonTimeLeft.innerHTML = `<b>Time Left:</b> ${timeLeft.days} Days, ${timeLeft.hours} Hours, ${timeLeft.minutes} Minutes`
    if (isOffSeason) {
        seasonTitle.textContent = "Off-Season";
        startDate.textContent = new Date(json.body[latestPopulatedIndex].end).toLocaleString();
        if (latestPopulatedIndex > 0) {
            endDate.textContent = new Date(json.body[latestPopulatedIndex - 1].start).toLocaleString();
        } else {
            endDate.textContent = "????-??-??, ?:??:??"
        }
    } else {
        playerCount.textContent = json.body[latestPopulatedIndex].totalScores;
        seasonTitle.textContent = json.body[liveSeasonIndex].name;
        startDate.textContent = new Date(json.body[liveSeasonIndex].start).toLocaleString();
        endDate.textContent = new Date(json.body[liveSeasonIndex].end).toLocaleString();
        playerCount.textContent = json.body[liveSeasonIndex].totalScores;
    }
}

function getTimeLeft(json) {
    let liveSeasonIndex = getLiveSeason(json)
    let isOffSeason;
    if (liveSeasonIndex === -1) {
        isOffSeason = true;
    } else {
        isOffSeason = false;
    }
    const latestPopulatedIndex = getLatestPopulatedSeason(json)
    const todayDate = new Date()
    // console.log(todayDate.toLocaleDateString());
    let endDate;
    // if off season and api has next season
    if (isOffSeason && latestPopulatedIndex > 0) {
        endDate = new Date(json.body[latestPopulatedIndex - 1].start);
    } else {
        endDate = new Date(json.body[latestPopulatedIndex].end);
    }
    // console.log(endDate.toLocaleDateString());
    let timeToEnd = (endDate - todayDate) /1000
    timeToEnd/=60 //seconds to minutes
    timeToEnd/=60 //minutes to hours
    daysLeft = timeToEnd / 24 //hours to days
    daysLeft = Math.floor(daysLeft)
    hoursLeft = timeToEnd % 24 //take remainder hours
    minutesLeft = (hoursLeft*60)%60;
    minutesLeft = Math.floor(minutesLeft)
    hoursLeft = Math.floor(hoursLeft)
    // console.log(daysLeft, hoursLeft, minutesLeft);
    return {days : daysLeft, hours : hoursLeft, minutes : minutesLeft}
}
updateSeasonInfo();
