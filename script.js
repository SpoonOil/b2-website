//grab nodes
const seasonTitle = document.querySelector('.seasonTitle');
const seasonTimeLeft = document.querySelector('.seasonTimeLeft');
const startDate = document.querySelector('.startDate');
const endDate = document.querySelector('.endDate');
const playerCount = document.querySelector('.playerCount');


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
        document.querySelector('.leaderboard>tbody').appendChild(playerRow);
    }  
}

function updateText(json) {
    // console.log(json);
    seasonTitle.textContent = json.body[0].name
    timeLeft = getTimeLeft(json);
    seasonTimeLeft.innerHTML = `<b>Time Left:</b> ${timeLeft.days} Days, ${timeLeft.hours} Hours, ${timeLeft.minutes} Minutes`
    startDate.textContent = new Date(json.body[0].start);
    endDate.textContent = new Date(json.body[0].end);
    playerCount.textContent = json.body[0].totalScores
}

function getTimeLeft(json) {
    const todayDate = new Date()
    // console.log(todayDate.toLocaleDateString());
    let endDate = new Date(json.body[0].end);
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