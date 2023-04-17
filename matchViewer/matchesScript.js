function getMatchInfo() {
    let url = window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
    fetch(url)
        .then(response => response.json())
        .then((json) => processMatchInfo(json))
        .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

function processMatchInfo(json) {
    matchHistory = json.body
    generateMatchTable(matchHistory);
}
function generateMatchTable(matchHistory) {
    let table = document.querySelector(".matchTable");
    for (let i = 0; i < matchHistory.length; i++) {
        //generate headers
        let row1 = table.insertRow();
        let row2 = table.insertRow();
        row1.classList.add("playerHeaderRow");
        let playerLeftHeader = document.createElement("th");
        row1.appendChild(playerLeftHeader);
        playerLeftHeader.colSpan = 4;
        let playerRightHeader = document.createElement("th");
        row1.appendChild(playerRightHeader);
        playerRightHeader.colSpan = 4;
        if (matchHistory[i].playerLeft.result == "win") {
            playerLeftHeader.classList.add("win");
            playerRightHeader.classList.add("lose");
        } else if (matchHistory[i].playerLeft.result == "lose") {
            playerLeftHeader.classList.add("lose");
            playerRightHeader.classList.add("win");
        } else if (matchHistory[i].playerLeft.result == "draw") {
            playerLeftHeader.classList.add("draw");
            playerRightHeader.classList.add("draw");
        }
        updatePlayerName(matchHistory[i].playerLeft, playerLeftHeader);
        updatePlayerName(matchHistory[i].playerRight, playerRightHeader);
        
        //generate dataRows
        for (key in matchHistory[i].playerLeft) {
            if (key == "profileURL" || key == "currentUser" || key == "result") {
                continue;
            }
            let cellLeft = row2.insertCell();
            cellLeft.textContent = matchHistory[i].playerLeft[key];
            cellLeft.classList.add("playerDataLeft");

        }
        for (key in matchHistory[i].playerLeft) {
            if (key == "profileURL" || key == "currentUser" || key == "result") {
                continue;
            }
            let cellRight = row2.insertCell();
            cellRight.textContent = matchHistory[i].playerRight[key];
            cellRight.classList.add("playerDataRight");

        }
    }

}

function updatePlayerName(player, slot) {
    let url = player.profileURL;
    async function nameFetch(url) {
        const response = await fetch(url);
        const json = await response.json();
        slot.textContent = json.body.displayName;
    }

    nameFetch(url);
}
getMatchInfo();