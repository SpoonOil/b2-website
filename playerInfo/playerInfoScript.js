const submit = document.querySelector('.submit');
const matchHistoryButton = document.querySelector('.matchHistoryButton');

const navMenu = document.querySelector(".toolList");

const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function fetchResults() {

  // Assemble the full URL
  let url = window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
  // Use fetch() to make the request to the API
  fetch(url)
    .then((response) => response.json())
    .then((json) => displayResults(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

function displayResults(json) {
  player = json.body;
  console.log(player)
  generateBanner(player)
  updateRankedStats(player);
  updateSummary(player);
  updateGeneralStats(player);
  updateMedals(player);
  updateRankHistory(player);
  updateLastMatch(player);
  updateClans(player);
  matchHistoryButton.addEventListener('click', () => {
    window.location.href = '../matchViewer/matches.html?' + player.matches;
  })
};

function generateBanner(player) {
  const playerBannerContainer = document.querySelector('.playerBannerContainer');
  const playerName = document.createElement('h1');
  playerName.classList.add('playerName');
  const playerIcon = document.createElement('img');
  playerIcon.classList.add('playerIcon');
  const playerBanner = document.createElement('img');
  playerBanner.classList.add('playerBanner');
  playerBanner.src = player.equippedBannerURL;
  playerBanner.borderImageSource = "url(player.equippedBorderURL)";
  playerName.textContent = `${player.displayName}`;
  playerIcon.src = player.equippedAvatarURL;
  playerBannerContainer.appendChild(playerBanner);
  playerBannerContainer.appendChild(playerIcon);
  playerBannerContainer.appendChild(playerName);
}

function updateRankedStats(player) {
  for (const key in player.rankedStats) {
    let dataOutput = document.querySelector(`[data-key = ${key.toString()}]>td:last-child`);
    dataOutput.textContent = player.rankedStats[key];
  }
}

function updateSummary(player) {
  function getColor(value){
    //value from 0 to 1
    if (value >= 0.5) {
      value = 1-value
      var hue=((1-value)*150).toString(10);
    } else if (value < 0.5) {
      var hue=((1-value)*50).toString(10);
    }
    return ["hsl(",hue,",100%,45%)"].join("");
  }
  const towers = player._towers
  let winrate = (player.rankedStats['wins']/(player.rankedStats['wins']+player.rankedStats['losses']))*100
  winrate = Math.floor(winrate*10)/10
  let favoriteTower1 = {
    'type': 'none',
    'used': 0
  }
  let favoriteTower2 = {
    'type': 'none',
    'used': 0
  }
  let favoriteTower3 = {
    'type': 'none',
    'used': 0
  }
  for (let i = 0; i < towers.length; i++) {
    tower = towers[i]
    const heroTowers = ['Quincy', 'Quincy_Cyber', 'Gwendolin', 'Gwendolin_Science', 'Churchill', 'Churchill_Sentai', 'StrikerJones', 'StrikerJones_Biker', 'Obyn', 'Obyn_Ocean', 'Benjamin', 'Benjamin_DJ', 'Ezili', 'Ezili_SmudgeCat', 'PatFusty', 'PatFusty_Snowman', 'Agent_Jericho', 'Highwayman_Jericho']
    if (tower == favoriteTower1 || tower == favoriteTower2 || tower == favoriteTower3) {
      continue
    }
    if (heroTowers.includes(tower.type)) {
      continue
    }
    if (tower.used > favoriteTower1.used) {
      favoriteTower3 = favoriteTower2
      favoriteTower2 = favoriteTower1
      favoriteTower1 = tower
      continue
    }
    if (tower.used > favoriteTower2.used) {
      favoriteTower3 = favoriteTower2
      favoriteTower2 = tower
    } else if (tower.used > favoriteTower3.used) {
      favoriteTower3 = tower
    }
  }

  let winrateText = document.querySelector('.winrateNum');
  let tower1 = document.querySelector('.tower1')
  let tower2 = document.querySelector('.tower2')
  let tower3 = document.querySelector('.tower3')
  winrateText.textContent = winrate + "%"
  winrateText.style.color = getColor((winrate/100))
  tower1Image = document.createElement('img');
  tower1Image.classList.add('towerImage');
  tower1Image.src = `../assets/images/towers/${favoriteTower1.type}.png`;
  tower1.appendChild(tower1Image);
  tower2Image = document.createElement('img');
  tower2Image.classList.add('towerImage');
  tower2Image.src = `../assets/images/towers/${favoriteTower2.type}.png`;
  tower2.appendChild(tower2Image);
  tower3Image = document.createElement('img');
  tower3Image.classList.add('towerImage');
  tower3Image.src = `../assets/images/towers/${favoriteTower3.type}.png`;
  tower3.appendChild(tower3Image);
}

function updateGeneralStats() {
  bloonStats = player._bloonStats;
  towerStats = player._towers;
  heroTable = document.querySelector('.heroClass>tbody');
  primaryTable = document.querySelector('.primaryClass>tbody');
  militaryTable = document.querySelector('.militaryClass>tbody');
  magicTable = document.querySelector('.magicClass>tbody');
  supportTable = document.querySelector('.supportClass>tbody');
  bloonTable = document.querySelector('.bloonClass>tbody');
  moabTable = document.querySelector('.moabClass>tbody');
  bloonStats.forEach(bloon => {generateBloonRow(bloon, bloonTable, moabTable)});
  for (let i = 0; i < towerStats.length; i++) {
    generateTowerRow(towerStats[i], heroTable, primaryTable, militaryTable, magicTable, supportTable);
  }
}

function generateTowerRow(tower, heroTable, primaryTable, militaryTable, magicTable, supportTable) {
  let towerClass = '';
  const primaryTowers = ['DartMonkey', 'TackShooter', 'BombShooter', 'BoomerangMonkey', 'IceMonkey', 'GlueGunner']
  const magicTowers = ['Alchemist', 'SuperMonkey', 'NinjaMonkey', 'Druid', 'WizardMonkey']
  const militaryTowers = ['MonkeySub', 'MonkeyAce', 'HeliPilot', 'SniperMonkey', 'DartlingGunner', 'MonkeyBuccaneer', 'MortarMonkey']
  const supportTowers = ['BananaFarm', 'SpikeFactory', 'MonkeyVillage', 'EngineerMonkey', 'BeastHandler']
  const heroTowers = ['Quincy', 'Quincy_Cyber', 'Gwendolin', 'Gwendolin_Science', 'Churchill', 'Churchill_Sentai', 'StrikerJones', 'StrikerJones_Biker', 'Obyn', 'Obyn_Ocean', 'Benjamin', 'Benjamin_DJ', 'Ezili', 'Ezili_SmudgeCat', 'PatFusty', 'PatFusty_Snowman', 'Agent_Jericho', 'Highwayman_Jericho']

  //set tower class based on what list its in
  if (primaryTowers.includes(tower.type)) {
    towerClass = 'primary';
  } else if (magicTowers.includes(tower.type)) {
    towerClass = 'magic';
  } else if (militaryTowers.includes(tower.type)) {
    towerClass = 'military';
  } else if (supportTowers.includes(tower.type)) {
    towerClass = 'support';
  } else if (heroTowers.includes(tower.type)) {
    towerClass = 'hero';
  }
  let row = document.createElement('tr');
  let name = document.createElement('th');
  let uses = document.createElement('td');
  name.textContent = tower.type;
  uses.textContent = tower.used;
  row.appendChild(name);
  row.appendChild(uses);
  switch (towerClass) {
    case 'hero':
      heroTable.appendChild(row);
      break;
    case 'primary':
      primaryTable.appendChild(row);
      break;
    case 'military':
      militaryTable.appendChild(row);
      break;
    case 'magic':
      magicTable.appendChild(row);
      break;
    case 'support':
      supportTable.appendChild(row);
      break;
    default:
      break;
  }
}

function generateBloonRow(bloon, bloonTable, moabTable) {
  let row = document.createElement('tr');
  let name = document.createElement('th');
  let sends = document.createElement('td');
  let pops = document.createElement('td');
  name.textContent = bloon.bloon_type;
  sends.textContent = bloon.sends;
  pops.textContent = bloon.pops;
  row.appendChild(name);
  row.appendChild(sends);
  row.appendChild(pops);
  if (bloon.bloon_type != bloon.bloon_type.toUpperCase()) {
    bloonTable.appendChild(row);
  } else {
    moabTable.appendChild(row);
  }
}

function updateRankHistory(player) {
  fetch(player.homs)
    .then((response) => response.json())
    .then((json) => displayRankHistory(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  function  displayRankHistory(json) {
    seasons = json.body;
    // console.log(seasons);
    if (seasons[0].rank) {
        let currentRank = seasons[0].rank;
        let currentScore = seasons[0].score;
        let currentTotal = seasons[0].totalScores;
        let currentRankDisplay = document.querySelector('.currentRank');
        currentRankDisplay.classList.add('currentRankDisplay');
        let currentRankNum = document.createElement('span');
        currentRankNum.classList.add('currentRankNum');
        let currentScoreNum = document.createElement('p');
        currentScoreNum.classList.add('currentScoreNum');
        let currentTotalNum = document.createElement('span');
        currentTotalNum.classList.add('currentTotalNum');
        currentScoreNum.textContent = `Score: ${currentScore}`;
        currentRankNum.textContent = currentRank;
        currentTotalNum.textContent = ` of ${currentTotal}`;
        currentRankDisplay.appendChild(currentRankNum);
        currentRankDisplay.appendChild(currentTotalNum);
        currentRankDisplay.appendChild(currentScoreNum);
    }
    if (seasons[1].rank) {
          let previousRank = seasons[1].rank;
          let previousScore = seasons[1].score;
          let previousTotal = seasons[1].totalScores;
          let previousRankDisplay = document.querySelector('.previousRank');
          previousRankDisplay.classList.add('previousRankDisplay');
          let previousRankNum = document.createElement('span');
          previousRankNum.classList.add('previousRankNum');
          let previousScoreNum = document.createElement('p');
          previousScoreNum.classList.add('previousScoreNum');
          let previousTotalNum = document.createElement('span');
          previousTotalNum.classList.add('previousTotalNum');
          previousScoreNum.textContent = `Score: ${previousScore}`;
          previousRankNum.textContent = previousRank;
          previousTotalNum.textContent = ` of ${previousTotal}`;
          previousRankDisplay.appendChild(previousRankNum);
          previousRankDisplay.appendChild(previousTotalNum);
          previousRankDisplay.appendChild(previousScoreNum);
    }
  }
}

function updateMedals(player) {
  for (badge in player.badges_all) {
    badgeImage = document.createElement('img');
    badgeImage.classList.add('badgeImage');
    badgeImage.src = player.badges_all[badge].iconURL;
    let badgeDisplay = document.querySelector('.badgeDisplay');
    badgeDisplay.appendChild(badgeImage);
  }
}

function updateLastMatch(player) {
  fetch(player.matches)
    .then((response) => response.json())
    .then((json) => displayLastMatch(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  function displayLastMatch(json) {
    match = json.body[0];
    players = [match.playerLeft, match.playerRight];
    for (let i = 0; i<2; i++) {
      if (players[i].currentUser && players[i].result == 'win') {
        matchDisplay = document.querySelector('.lastMatchResult')
        matchDisplay.textContent = 'WIN';
        matchDisplay.classList.add('win');
      } else if (players[i].currentUser && players[i].result == 'lose') {
        matchDisplay = document.querySelector('.lastMatchResult')
        matchDisplay.textContent = 'LOSE';
        matchDisplay.classList.add('lose');
      } else if (players[i].currentUser && players[i].result == 'draw') {
        matchDisplay = document.querySelector('.lastMatchResult')
        matchDisplay.textContent = 'DRAW';
        matchDisplay.classList.add('draw');
      }
    }
  }
}

function updateClans(player) {
  if (player.inGuild == true) {
    fetch(player.guild)
      .then((response) => response.json())
      .then((json) => showClanStats(json))
      .catch((error) => console.error(`Error fetching data: ${error.message}`));
  }

  function showClanStats(json) {
    clan = json.body
    console.log(clan)
    document.getElementById("clanTitle").innerHTML = `<h3 class="summaryHeader">Clan Stats</h3>`
    let clanContainer = document.getElementById("clanContent")
    clanContainer.classList.add("clanContent")
    let clanFilterStatus;
    switch (clan.status) {
      case "OPEN": 
        clanFilterStatus = "Public"
        break;
      case "FILTERED": 
        clanFilterStatus = "Private"
        break;
      default:
        clanFilterStatus = "Unknown"
        break;
    }
    clanContainerContent = `
      <div class="clanBannerContainer">
        <div class="clanBanner" style="background-image:url('${clan.bannerURL}')">
          <h1 class="clanName">${clan.name}</h1>
        </div>
      </div>
      <div class="clanInfo">
        <div class="clanStats">
          <h4>Members</h4><p>${clan.numMembers}/25</p>
        </div>
        <div class="clanStats">
          <h4>Status</h4><p>${clanFilterStatus}</p>
        </div>
        <div class="clanDescription">
          ${clan.tagline}
        </div>
      </div>
      <button type="button" class="clanButton" id="clanButton">View Clan</button>
    `
    clanContainer.insertAdjacentHTML("beforeend", clanContainerContent)
    document.getElementById("clanButton").addEventListener('click', () => {
      window.location.href = '../clanViewer/clan.html?' + player.guild;
    })
  }
}

window.onload = function () {
  // Call the fetchResults() function when the page loads
  fetchResults();
}