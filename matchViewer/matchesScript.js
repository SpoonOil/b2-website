const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.toolList');
const primaryMatchData = ["hero", "towerone", "towertwo", "towerthree"]
const secondaryMatchData = ["gametype", "duration", "map", "endRound"]
const displayTerms = {
    "maps": [
        ["banana_depot_scene", "Banana Depot"],
        ["basalt_columns", "Basalt Columns"],
        ["building_site_scene", "Building Site"],
        ["bloon_bot_factory", "Bloon Bot Factory"],
        ["basalt_columns", "Basalt Columns"],
        ["castle_ruins", "Castle Ruins"],
        ["cobra_command", "Cobra Command"],
        ["dino_graveyard", "Dino Graveyard"],
        ["garden", "Garden"],
        ["glade", "Glade"],
        ["inflection", "Inflection"],
        ["koru", "Koru"],
        ["oasis", "Oasis"],
        ["ports", "Ports"],
        ["sands_of_time", "Sands Of Time"],
        ["star", "Star"],
        ["pirate_cove", "Pirate Cove"],
        ["precious_space", "Precious Space"]
    ],
    "towers": [
        ["DartMonkey", "Dart Monkey"],
        ["BoomerangMonkey", "Boomerang Monkey"],
        ["BombShooter", "Bomb Shooter"],
        ["TackShooter", "Tack Shooter"],
        ["IceMonkey", "Ice Monkey"],
        ["GlueGunner", "Glue Gunner"],
        ["SniperMonkey", "Sniper Monkey"],
        ["MonkeySub", "Monkey Sub"],
        ["MonkeyBuccaneer", "Monkey Buccaneer"],
        ["MonkeyAce", "Monkey Ace"],
        ["HeliPilot", "Heli Pilot"],
        ["MortarMonkey", "Mortar Monkey"],
        ["DartlingGunner", "Dartling Gunner"],
        ["WizardMonkey", "Boomerang"],
        ["SuperMonkey", "Boomerang"],
        ["NinjaMonkey", "Boomerang"],
        ["Alchemist", "Alchemist"],
        ["Druid", "Druid"],
        ["MonkeyVillage", "Monkey Village"],
        ["BananaFarm", "Banana Farm"],
        ["SpikeFactory", "Spike Factory"],
        ["EngineerMonkey", "Engineer Monkey"],
        ["BoomerangMonkey", "Boomerang"],
        ["BoomerangMonkey", "Boomerang"],
        ["BoomerangMonkey", "Boomerang"],
        ["BoomerangMonkey", "Boomerang"],
        ["BoomerangMonkey", "Boomerang"],
        ["BoomerangMonkey", "Boomerang"],
        ["BoomerangMonkey", "Boomerang"]
    ],
    "heroes": [
        ["Quincy", "Quincy"],
        ["Quincy_Cyber", "Cyber Quincy"],
        ["Gwendolin", "Gwendolin"],
        ["Gwendolin_Science", "Science Gwendolin"],
        ["Obyn", "Obyn"],
        ["Obyn_Ocean", "Ocean Obyn"],
        ["StrikerJones", "Striker Jones"],
        ["StrikerJones_Biker", "Biker Bones"],
        ["Churchill", "Captain Churchill"],
        ["Churchill_Sentai", "Sentai Churchill"],
        ["Benjamin", "Benjamin"],
        ["Benjamin_DJ", "DJ Benjammin'"],
        ["Ezili", "Ezili"],
        ["Ezili_SmudgeCat", "Smudge Catt Ezili"],
        ["PatFusty", "Pat Fusty"],
        ["PatFusty_Snowman", "Fusty The Snowman"],
        ["Jericho", "Agent Jericho"],
        ["Agent_Jericho", "Agent Jericho"],
        ["Jericho_Highwayman", "Highwayman Jericho"],
        ["Jericho_StarCaptain", "Star Captain Jericho"]
    ]
}

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function tableSwap(){
    var t= document.getElementsByTagName('tbody')[0],
    r= t.getElementsByTagName('tr'),
    cols= r.length, rows= r[0].getElementsByTagName('td').length,
    cell, next, tem, i= 0, tbod= document.createElement('tbody');

    while(i<rows){
        cell= 0;
        tem= document.createElement('tr');
        while(cell<cols){
            next= r[cell++].getElementsByTagName('td')[0];
            tem.appendChild(next);
        }
        tbod.appendChild(tem);
        ++i;
    }
    t.parentNode.replaceChild(tbod, t);
}

function getMatchInfo() {
    let url = window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
    fetch(url)
        .then(response => response.json())
        .then((json) => processMatchInfo(json))
        .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

function processMatchInfo(json) {
    matchHistory = json.body
    console.log(json)
    generateMatchTable(matchHistory);
}
function generateMatchTable(matchHistory) {
    let tableContainer = document.querySelector(".matchTableContainer");
    for (let i = 0; i < matchHistory.length; i++) {
        let currentMatchContainer = document.createElement('div')
        currentMatchContainer.classList.add("match");
        let table = document.createElement("table");
        table.classList.add("matchTable");
        currentMatchContainer.appendChild(table);
        tableContainer.appendChild(currentMatchContainer);
        //generate headers
        let row1 = table.insertRow();
        let row2 = table.insertRow();
        let expanderButton = document.createElement("button");
        expanderButton.classList.add("expanderButton");
        expanderButton.textContent = "More Info";
        currentMatchContainer.appendChild(expanderButton);
        expanderButton.addEventListener("click", function handleClick() {
            expandTable(currentMatchContainer, matchHistory[i])
        });
        row1.classList.add("playerHeaderRow");
        let playerLeftHeader = document.createElement("th");
        playerLeftHeader.classList.add("playerHeaderCell");
        playerLeftHeader.classList.add('playerLeft')
        row1.appendChild(playerLeftHeader);
        playerLeftHeader.colSpan = 4;
        let playerRightHeader = document.createElement("th");
        playerRightHeader.classList.add("playerHeaderCell");
        playerRightHeader.classList.add('playerRight')
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
        } else if (matchHistory[i].playerLeft.result == "lobbyDC") {
            playerLeftHeader.classList.add("lobbyDC");
            playerRightHeader.classList.add("opponentLobbyDC");
        } else if (matchHistory[i].playerLeft.result == "opponentLobbyDC") {
            playerLeftHeader.classList.add("opponentLobbyDC");
            playerRightHeader.classList.add("lobbyDC");
        }

        updatePlayerName(matchHistory[i].playerLeft, playerLeftHeader);
        updatePlayerName(matchHistory[i].playerRight, playerRightHeader);

        //generate dataRows
        let towerRowContainer = document.createElement("div");
        towerRowContainer.classList.add("towerRowContainer");
        let towerRowLeft = document.createElement("div")
        towerRowLeft.classList.add("towerRow");
        table.appendChild(towerRowLeft);
        for (key in matchHistory[i].playerLeft) {
            let isPrimary = false
            for (entry in primaryMatchData) {
                if (key == primaryMatchData[entry]) {isPrimary = true}
            }
            if (isPrimary == false) {continue}
            let cellLeft = document.createElement("div");
            cellLeft.classList.add("tower");
            towerRowLeft.appendChild(cellLeft);
            if (key == "towerone" || key == "towertwo" || key == "towerthree") {
                towerImg = document.createElement("img");
                towerImg.classList.add("towerImg");
                towerImg.src = "../assets/images/towers/" + matchHistory[i].playerLeft[key] + ".png";
                cellLeft.appendChild(towerImg);
                // cellLeft.textContent = replaceWithDisplayTerm("towers", matchHistory[i].playerLeft[key]);
            } else if (key == "hero") {
                heroImg = document.createElement("img");
                heroImg.classList.add("heroImg");
                heroImg.classList.add("towerImg");
                heroImg.src = "../assets/images/heroes/" + matchHistory[i].playerLeft[key] + ".webp";
                cellLeft.appendChild(heroImg);
            } else {
                cellLeft.textContent = matchHistory[i].playerLeft[key];
            }
            cellLeft.classList.add("playerDataLeft");
            if (matchHistory[i].playerLeft.currentUser) {
                cellLeft.classList.add("currentUser");
            }
        }
        // add map thumbnail

        let mapCell = document.createElement("div");
        mapCell.classList.add("mapCell");

        let mapImg = document.createElement("img");
        mapImg.classList.add("mapImg");
        mapImg.src = matchHistory[i].mapURL
        mapCell.appendChild(mapImg);
        let j = 0;
        let towerRowRight = document.createElement("div")
        towerRowRight.classList.add("towerRow");
        table.appendChild(towerRowRight);
        towerRowContainer.appendChild(towerRowLeft);
        towerRowContainer.appendChild(mapCell);
        towerRowContainer.appendChild(towerRowRight);
        table.appendChild(towerRowContainer);
        for (key in matchHistory[i].playerRight) {
            j++
            let isPrimary = false
            for (entry in primaryMatchData) {
                if (key == primaryMatchData[entry]) {isPrimary = true}
            }
            if (isPrimary == false) {continue}
            let cellRight = document.createElement("div");
            cellRight.classList.add("tower");
           towerRowRight.appendChild(cellRight);
            if (key == "towerone" || key == "towertwo" || key == "towerthree") {
                towerImg = document.createElement("img");
                towerImg.classList.add("towerImg");
                towerImg.src = "../assets/images/towers/" + matchHistory[i].playerRight[key] + ".png";
                cellRight.appendChild(towerImg);
                // cellRight.textContent = replaceWithDisplayTerm("towers", matchHistory[i].playerRight[key]);
            } else if (key == "hero") {
                heroImg = document.createElement("img");
                heroImg.classList.add("heroImg");
                heroImg.classList.add("towerImg");
                heroImg.src = "../assets/images/heroes/" + matchHistory[i].playerRight[key] + ".webp";
                cellRight.appendChild(heroImg);
                // cellRight.textContent = replaceWithDisplayTerm("heroes", matchHistory[i].playerRight[key]);
            } else {
                cellRight.textContent = matchHistory[i].playerRight[key];
            }
            cellRight.classList.add("playerDataRight");
            if (matchHistory[i].playerRight.currentUser) {
                cellRight.classList.add("currentUser");
            }
        }

        if (matchHistory[i].playerLeft.currentUser) {
            playerLeftHeader.classList.add("currentUser");
        } else {
            playerRightHeader.classList.add("currentUser");
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
            window.open('../playerInfo/playerInfo.html?' + url, '_self');
        })
    }

    nameFetch(url);
}

let playerSideToggle = document.querySelector("#playerSideToggle");
playerSideToggle.addEventListener("click", () => {togglePlayerSide()});

function togglePlayerSide() {
    currentPlayers = document.getElementsByClassName("currentUser");

    for(i = 0; i < currentPlayers.length; i++) {
        if (currentPlayers[i].classList.contains('playerLeft') === false) {
            if (currentPlayers[i].classList.contains('forceLeft')) {
                currentPlayers[i].classList.remove('forceLeft');
            } else {
                currentPlayers[i].classList.add('forceLeft');
            }
        }
    }
}

function expandTable(matchContainer, matchInfo) {
    console.log(matchInfo);
    toggleExpansionState(matchContainer);
    if (matchContainer.classList.contains("expanded")) {
        createExpansion(matchInfo, matchContainer);
    } else {
        matchContainer.removeChild(matchContainer.lastChild);
    }
}
getMatchInfo();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createExpansion(matchInfo, matchContainer) {
    let extraInfoContainer = document.createElement("div");
    extraInfoContainer.classList.add("extraInfoContainer");
    for (key in matchInfo) {
        let isPrimary = false
        for (entry in primaryMatchData) {
            if (key == primaryMatchData[entry]) {isPrimary = true}
        }
        if (isPrimary == true) {continue}
        let isSecondary = false
        for (entry in secondaryMatchData) {
            if (key == secondaryMatchData[entry]) {isSecondary = true}
        }
        if (isSecondary == false) {continue}
        let extraInfo = document.createElement("div");
        extraInfo.classList.add("extraInfo");
        if (key == "map") {
            let value = matchInfo[key]
            value = replaceWithDisplayTerm("maps", value)
            extraInfo.innerHTML = `<h5>${capitalizeFirstLetter(key)}</h5><p>${value}</p>`;
        } else if (key == "duration") {
            extraInfo.innerHTML = `<h5>${capitalizeFirstLetter(key)}</h5><p>${matchInfo[key]} seconds</p>`;
        } else if (key == "endRound") {
            extraInfo.innerHTML = `<h5>End Round</h5><p>${++matchInfo[key]}</p>`;
        } else {
            extraInfo.innerHTML = `<h5>${capitalizeFirstLetter(key)}</h5><p>${matchInfo[key]}</p>`;
        }
        extraInfoContainer.appendChild(extraInfo);
    }
    matchContainer.appendChild(extraInfoContainer);
}

function toggleExpansionState(matchContainer) {
    let expanderButton = matchContainer.querySelector(".expanderButton");
    if (matchContainer.classList.contains("expanded")) {
        setExpansionStateToExpanded(matchContainer, expanderButton);
    } else {
        matchContainer.classList.add("expanded");
        expanderButton.textContent = "Less Info";
    }
}
function setExpansionStateToExpanded(matchContainer, expanderButton) {
    matchContainer.classList.remove("expanded");
    expanderButton.textContent = "More Info";
}

function replaceWithDisplayTerm(category, term) {
    for (mapNumber in displayTerms[category]) {
        if (term == displayTerms[category][mapNumber][0]) {
            return displayTerms[category][mapNumber][1]
        }
    }
    return term
}
