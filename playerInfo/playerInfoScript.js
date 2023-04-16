const submit = document.querySelector('.submit');
const playerName = document.querySelector('.playerName');
const playerIcon = document.querySelector('.playerIcon');


function fetchResults(e) {

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
    playerName.textContent = `${player.displayName}`;
    playerIcon.src = player.equippedAvatarURL;
    updateRankedStats(player);
  };

function updateRankedStats(player) {
  for (const key in player.rankedStats) {
    console.log(key);
    console.log(player.rankedStats[key]);
    let keyRow = document.querySelector(`[data-key = ${key.toString()}]`);
    let dataOutput = document.querySelector(`[data-key = ${key.toString()}]>td:last-child`);
    console.log(keyRow);
    dataOutput.textContent = player.rankedStats[key];
  }
}

window.onload = function () {
  // Call the fetchResults() function when the page loads
  // This will make the API call and display the results.
  // This function is defined at the bottom of this file.
  // 
  fetchResults();
}