let resultsFound = 0;

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".toolList");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

const searchButton = document.querySelector('.searchSubmit');
const searchRadios = document.querySelectorAll('.searchRadio');
searchButton.addEventListener('click', (e) => searchPlayers(e));

searchRadios.forEach(radio => {
    radio.addEventListener('click', (e) => updateModeSegment(e));
});

const seasonRadios = document.querySelectorAll('.seasonRadio');
seasonRadios.forEach(radio => {
    radio.addEventListener('click', (e) => updateSeasonSegment(e));
});

function updateSeasonSegment(e) {
    console.log(e);
    const seasons = document.querySelectorAll('.seasonLabel');
    for (season of seasons) {
        season.classList.remove('pressed');
    }
    e.target.classList.add('pressed')
    season = document.querySelector('.seasonLabel[for='+e.target.id+']');
    season.classList.add('pressed');
}

function updateModeSegment(e) {
    console.log(e);
    const segments = document.querySelectorAll('.segmentLabel');
    for (segment of segments) {
        segment.classList.remove('pressed');
    }
    e.target.classList.add('pressed')
    segment = document.querySelector('.segmentLabel[for='+e.target.id+']');
    segment.classList.add('pressed');
}


function searchPlayers(e) {
    e.preventDefault();
    const searchInput = document.querySelector('#searchBar');
    const searchValue = searchInput.value;
    const searchMode = document.querySelector('input[name="searchMode"]:checked').value
    const searchSeason = document.querySelector('input[name="searchSeason"]:checked').value
    clearChildren(document.querySelector('.resultsOutput'))
    resultsFound = 0;
    rankIndex = 1;
    searchAPI(searchValue, searchMode, 'https://data.ninjakiwi.com/battles2/homs/'+searchSeason+'/leaderboard');
}

function searchAPI(searchValue, searchMode, url) {
    console.log(url)
    if (searchMode != 'oak') {
        fetch(url)
            .then(response => response.json())
            .then((json) => {processData(json, searchMode, searchValue)})
            .catch(error => console.log(error))
    } else {
        // oak_6d70312f0e6a3dacb41a23f8bbada10a Rosco OAK for testing
        console.log(searchValue)
        newUrl = "../playerInfo/playerInfo.html?" + 'https://data.ninjakiwi.com/battles2/users/' + searchValue+ '/'
        console.log(newUrl)
        window.open(newUrl, '_self');
    }
}

function processData(json, searchMode, searchValue) {
    const players = json.body;
    let resultsFound = 0;
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (searchMode == "name") {
            if (player.displayName.toLowerCase().includes(searchValue.toLowerCase())) {
                resultsFound++;
                generatePlayerCard(player, rankIndex, resultsFound<10);
            }
        }  else if (searchMode == "score") {
            if (searchValue.match(/^\d+$/) ) {//match numbers)
                if (player.score.toString().includes(searchValue)) {
                    resultsFound++;
                    generatePlayerCard(player, rankIndex, resultsFound<10);
                }
            } else {
                let evalValue = searchValue;
                evalValue = evalValue.replace('\|\|', '\|\| player.score.toString() ')
                evalValue = evalValue.replace(/&&/, '&& player.score.toString()')
                // evalValue = evalValue.replace('<=', '<= player.score.toString()')
                // evalValue = evalValue.replace('>=', '>= player.score.toString()');
                // evalValue = evalValue.replace('==', '== player.score.toString()')
                // evalValue = evalValue.replace('!=', '!= player.score.toString()')
                if (eval(player.score.toString() + evalValue)) {
                    resultsFound++;
                    generatePlayerCard(player, rankIndex, resultsFound<10);
                }
            }
        } else if (searchMode == "place") {
            if (searchValue.match(/^\d+$/) ) {//match numbers)
                if (rankIndex == searchValue) {
                    resultsFound++;
                    generatePlayerCard(player, rankIndex, resultsFound<10);
                }
            } else {
                let evalValue = searchValue;
                evalValue = evalValue.replace('\|\|', '\|\| rankIndex')
                evalValue = evalValue.replace(/&&/, '&& rankIndex')
                // evalValue = evalValue.replace('<=', '<= player.score.toString()')
                // evalValue = evalValue.replace('>=', '>= player.score.toString()');
                // evalValue = evalValue.replace('==', '== player.score.toString()')
                // evalValue = evalValue.replace('!=', '!= player.score.toString()')
                if (eval(rankIndex + evalValue)) {
                    resultsFound++;
                    generatePlayerCard(player, rankIndex, resultsFound<10);

                }
            }
        }
        rankIndex++;
    }
    if (json.next) {
        searchAPI(searchValue, searchMode, json.next)
    } else if (resultsFound == 0) {
        document.querySelector('.resultsOutput').innerHTML = 'No results found';
    }
}

function generatePlayerCard(player, rankIndex, portraitRetrieval = true) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('playerCard');
    console.log(rankIndex)
    playerCard.innerHTML = `
    <div class="playerImageContainer">
    <img src="https://cdn.discordapp.com/attachments/921447683846180976/1098996347065090240/sauda_avatar_large.png" class="playerCardImage" alt="${player.displayName} Avatar">
    </div>
    <div class="playerCardInfo">
    <h3 class="playerCardName" id = "rank${rankIndex.toString()}"></h3>
    <p class="playerCardScore"><span class="playerCardScoreLabel playerCardLabel">Score:</span> ${player.score}</p>
    <p class="playerCardPlace"><span class="playerCardPlaceLabel playerCardLabel">Place:</span> ${rankIndex}</p>
    <a class="playerCardLink" href="../playerInfo/playerInfo.html?${player.profile}"><div class="playerCardProfileButton">Profile</div></a>
    </div>
    `;
    document.querySelector('.resultsOutput').appendChild(playerCard);
    document.querySelector("#rank"+rankIndex.toString()).textContent = player.displayName;
    
    if(portraitRetrieval){
        const playerImage = playerCard.querySelector('.playerCardImage');
        updatePlayerImages(player, playerImage)
    }
}

async function updatePlayerImages(player, playerImage) {
    const response = await fetch(player.profile);
    const json = await response.json();
    for (badge in json.body.badges_equipped) {
        badgeImage = document.createElement('img');
        badgeImage.src = json.body.badges_equipped[badge].iconURL;
        imageContainer = playerImage.parentElement;
        imageContainer.appendChild(badgeImage);
    }
    playerImage.src = json.body.equippedAvatarURL;
}

function clearChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
