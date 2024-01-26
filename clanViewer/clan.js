function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
 }

async function fetchResults() {
  // Assemble the full URL
  let url = window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
  // Use fetch() to make the request to the API
  
  await fetch(url)
    .then((response) => response.json())
    .then((json) => generateClanContent(json))
    .then(showContent())
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

async function showContent() {
  document.querySelector(".loadingContainer").classList.remove("loading")
  document.querySelector(".content").classList.add("contentShow")
}
 
async function generateClanContent(json) {
  clanBanner(json)
  clanData(json)
  await fetchWarData(json)
  await delay(2000)
}

function clanBanner(json) {
  clan = json.body
  console.log(clan)
  clanContainerContent = `
    <div class="clanBanner" style="background-image:url('${clan.bannerURL}')">
      <h1 class="clanName">${clan.name}</h1>
    </div>
  `
  document.getElementById("clanBanner").insertAdjacentHTML("beforeend", clanContainerContent)
}

function clanData(json) {
  clan = json.body
  document.getElementById("memberCount").innerText = `${clan.numMembers}/25`
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
  fetch(clan.owner)
    .then((response) => response.json())
    .then((json) => console.log(document.getElementById("owner").innerText = json.body.displayName))
    .then(
      document.getElementById("ownerButton").addEventListener('click', () => {
        window.location.href = '../playerInfo/playerInfo.html?' + clan.owner;
      })
    )
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  document.getElementById("clanStatus").innerText = clanFilterStatus
  document.getElementById("clanDescription").innerText = clan.tagline
}

async function fetchWarData(json) {
  clan = json.body
  await fetch(clan.wars)
    .then((response) => response.json())
    .then((json) => warData(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
  async function warData(json) {
    wars = json.body
    console.log(wars)
    for (let warKey in wars) {
      let war = wars[warKey]
      console.log(war)
      let warLeaderboardString = ``
      for (let leaderboardClanKey in war.groupGuildLeaderboard) {
        let warLeaderboardClanData;
        await fetch(war.groupGuildLeaderboard[leaderboardClanKey].url)
          .then((response) => response.json())
          .then((json) => warLeaderboardClanData = json.body)
          .catch((error) => console.error(`Error fetching data: ${error.message}`));
        warLeaderboardString += `
          <tr>
            <td>${Number(leaderboardClanKey)+1}</td>
            <td><a href="../clanViewer/clan.html?${war.groupGuildLeaderboard[leaderboardClanKey].url}">${warLeaderboardClanData.name}</a></td>
            <td>${war.groupGuildLeaderboard[leaderboardClanKey].score}</td>
          </tr>
        `
      }
      let memberLeaderboardString = ``
      for (let memberKey in war.memberContributionsLeaderboard) {
        let memberLeaderboardClanData;
        await fetch(war.memberContributionsLeaderboard[memberKey].url)
          .then((response) => response.json())
          .then((json) => memberLeaderboardClanData = json.body)
          .catch((error) => console.error(`Error fetching data: ${error.message}`));
        memberLeaderboardString += `
          <tr>
            <td>${Number(memberKey)+1}</td>
            <td><a href="../playerInfo/playerInfo.html?${war.memberContributionsLeaderboard[memberKey].url}">${memberLeaderboardClanData.displayName}</a></td>
            <td>${war.memberContributionsLeaderboard[memberKey].score}</td>
          </tr>
        `
      }
      document.getElementById("warTitle").classList.add("showWarTitle")
      document.getElementById("wars").insertAdjacentHTML("beforeend", `
        <div class="warContainer">
          <h4>War Leaderboard</h4>
          <table class="statsTable" id="statsTable">
            ${warLeaderboardString}
          </table>
          <h4>Member Contributions</h4>
          <table class="statsTable" id="statsTable">
            ${memberLeaderboardString}
          </table>
        </div>
      `)
    }
    document.querySelector(".loadingWars").classList.remove("loading")
  }
}

window.onload = async function () {
  // Call the fetchResults() function when the page loads
  await fetchResults();
}