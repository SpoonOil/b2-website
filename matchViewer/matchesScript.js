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
    let tableContainer = document.querySelector(".matchTableContainer");
    for (let i = 0; i < matchHistory.length; i++) {
        let table = document.createElement("table");
        table.classList.add("matchTable");
        tableContainer.appendChild(table);
        //generate headers
        let row1 = table.insertRow();
        let row2 = table.insertRow();
        let expanderRow = table.insertRow();
        expanderRow.classList.add("expanderRow");
        let expanderCell = expanderRow.insertCell()
        expanderCell.classList.add("expanderCell");
        expanderCell.colSpan = 8;
        let expanderButton = document.createElement("button");
        expanderButton.classList.add("expanderButton");
        expanderButton.textContent = "More Info";
        expanderCell.appendChild(expanderButton);
        expanderButton.addEventListener("click", (table) => expandTable(table));
        row1.classList.add("playerHeaderRow");
        let playerLeftHeader = document.createElement("th");
        playerLeftHeader.classList.add("playerHeaderCell");
        row1.appendChild(playerLeftHeader);
        playerLeftHeader.colSpan = 4;
        let playerRightHeader = document.createElement("th");
        playerRightHeader.classList.add("playerHeaderCell");
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

        if (matchHistory[i].playerLeft.currentUser) {
            playerLeftHeader.classList.add("currentUser");
        } else {
            playerRightHeader.classList.add("currentUser");
        }
        updatePlayerName(matchHistory[i].playerLeft, playerLeftHeader);
        updatePlayerName(matchHistory[i].playerRight, playerRightHeader);
        
        //generate dataRows
        row2.classList.add("playerDataRow");
        for (key in matchHistory[i].playerLeft) {
            if (key == "profileURL" || key == "currentUser" || key == "result") {
                continue;
            }
            let cellLeft = row2.insertCell();
            cellLeft.textContent = matchHistory[i].playerLeft[key];
            cellLeft.classList.add("playerDataLeft");

        }
        for (key in matchHistory[i].playerRight) {
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
        slot.addEventListener("click", () => {
            window.open('../playerInfo/playerInfo.html?' + url, '_blank');
        })
    }

    nameFetch(url);
}

let playerSideToggle = document.querySelector("#playerSideToggle");
playerSideToggle.addEventListener("click", () => {togglePlayerSide()});

function togglePlayerSide() {
    currentPlayers = document.getElementsByClassName("currentUser");
    for(i = 0; i < currentPlayers.length; i++) {
        if (currentPlayers[i].classList.contains('forceLeft')) {
            currentPlayers[i].classList.remove('forceLeft');
            playerData = document.getElementsByClassName("playerDataRight");
            for (j = 0; j < playerData.length; j++) {
                playerData[j].classList.remove('forceLeft');
            }
        } else {
            currentPlayers[i].classList.add('forceLeft');
            playerData = document.getElementsByClassName("playerDataRight");
            for (j = 0; j < playerData.length; j++) {
                playerData[j].classList.add('forceLeft');
            }
        }
    }
}
getMatchInfo();