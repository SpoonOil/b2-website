const searchButton = document.querySelector('.searchSubmit');
let resultFound = false;

searchButton.addEventListener('click', (e) => searchPlayers(e));

function searchPlayers(e) {
    e.preventDefault();
    const searchInput = document.querySelector('#searchBar');
    const searchValue = searchInput.value;
    const searchMode = document.querySelector('input[name="searchMode"]:checked').value
    clearChildren(document.querySelector('.resultsOutput'))
    resultFound = false;
    rankIndex = 1;
    searchAPI(searchValue, searchMode);
}

function searchAPI(searchValue, searchMode, url = 'https://data.ninjakiwi.com/battles2/homs/season_10/leaderboard') {
    fetch(url)
        .then(response => response.json())
        .then((json) => {processData(json, searchMode, searchValue)})
        .catch(error => console.log(error))
}

function processData(json, searchMode, searchValue) {
    const players = json.body;
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (searchMode == "name") {
            if (player.displayName.toLowerCase().includes(searchValue.toLowerCase())) {
                resultFound = true;
                generatePlayerCard(player, rankIndex);
            }
        }  else if (searchMode == "score") {
            if (searchValue.match(/^\d+$/) ) {//match numbers)
                if (player.score.toString().includes(searchValue)) {
                    resultFound = true;
                    generatePlayerCard(player, rankIndex);
                }
            } else {
                let evalValue = searchValue;
                evalValue = evalValue.replace('\|\|', '\|\| player.score.toString() ')
                evalValue = evalValue.replace(/&&/, '&& player.score.toString()')
                console.log(searchValue);
                console.log(evalValue)
                // evalValue = evalValue.replace('<=', '<= player.score.toString()')
                // evalValue = evalValue.replace('>=', '>= player.score.toString()');
                // evalValue = evalValue.replace('==', '== player.score.toString()')
                // evalValue = evalValue.replace('!=', '!= player.score.toString()')
                if (eval(player.score.toString() + evalValue)) {
                    resultFound = true;
                    generatePlayerCard(player, rankIndex);
                
                }
            }
        } else if (searchMode == "place") {
            if (searchValue.match(/^\d+$/) ) {//match numbers)
                if (rankIndex == searchValue) {
                    resultFound = true;
                    generatePlayerCard(player, rankIndex);
                }
            } else {
                let evalValue = searchValue;
                evalValue = evalValue.replace('\|\|', '\|\| rankIndex')
                evalValue = evalValue.replace(/&&/, '&& rankIndex')
                console.log(searchValue);
                console.log(evalValue)
                // evalValue = evalValue.replace('<=', '<= player.score.toString()')
                // evalValue = evalValue.replace('>=', '>= player.score.toString()');
                // evalValue = evalValue.replace('==', '== player.score.toString()')
                // evalValue = evalValue.replace('!=', '!= player.score.toString()')
                if (eval(rankIndex + evalValue)) {
                    resultFound = true;
                    generatePlayerCard(player, rankIndex);
                
                }
            }
        }
        rankIndex++;
    }
    if (json.next) {
        searchAPI(searchValue, searchMode, json.next)
    } else if (!resultFound) {
        document.querySelector('.resultsOutput').innerHTML = 'No results found';
    }
}

function generatePlayerCard(player, rankIndex) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('playerCard');
    playerCard.innerHTML = `
    <div class="playerImageContainer">
    <img src="https://placehold.it/20" class="playerCardImage" alt="${player.displayName} Avatar">
    </div>
    <div class="playerCardInfo">
    <h3 class="playerCardName">${player.displayName}</h3>
    <p class="playerCardScore">Score: ${player.score}</p>
    <p class="playerCardPlace">Place: ${rankIndex}</p>
    <a class="playerCardLink" href="../playerInfo/playerInfo.html?${player.profile}">Profile</a>
    </div>
    `;
    document.querySelector('.resultsOutput').appendChild(playerCard);
    const playerImage = playerCard.querySelector('.playerCardImage');
    updatePlayerImages(player, playerImage)
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