const searchButton = document.querySelector('.searchSubmit');

searchButton.addEventListener('click', (e) => searchPlayers(e));

function searchPlayers(e) {
    e.preventDefault();
    const searchInput = document.querySelector('#searchBar');
    const searchValue = searchInput.value;
    clearChildren(document.querySelector('.resultsOutput'))
    searchAPI(searchValue);
}

function searchAPI(searchValue, url = 'https://data.ninjakiwi.com/battles2/homs/season_10/leaderboard') {
    fetch(url)
        .then(response => response.json())
        .then((json) => {processData(json, searchValue)})
        .catch(error => console.log(error))
}

function processData(json, searchValue) {
    const players = json.body;
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.displayName.toLowerCase().includes(searchValue.toLowerCase())) {
            generatePlayerCard(player);
        }
    }
    if (json.next) {
        searchAPI(searchValue, json.next)
    }
}

function generatePlayerCard(player) {
    const playerCard = document.createElement('div');
    playerCard.classList.add('playerCard');
    playerCard.innerHTML = `
    <div class="playerCardImageHolder">
    <img src="https://placehold.it/20" class="playerCardImage" alt="${player.displayName} Avatar">
    </div>
    <div class="playerCardInfo">
    <h3 class="playerCardName">${player.displayName}</h3>
    <p class="playerCardScore">Score: ${player.score}</p>
    <a class="playerCardLink" href="../playerInfo/playerInfo.html?${player.profile}">Profile</a>
    </div>
    `;
    document.querySelector('.resultsOutput').appendChild(playerCard);
    const playerImage = playerCard.querySelector('.playerCardImage');
    updatePlayerImage(player, playerImage)
}

async function updatePlayerImage(player, playerImage) {
    const response = await fetch(player.profile);
    const json = await response.json();
    playerImage.src = json.body.equippedAvatarURL;
}

function clearChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}