const submit = document.querySelector('.submit');
const playerName = document.querySelector('.playerName');

submit.addEventListener("click", submitSearch);

function submitSearch(e) {
  fetchResults(e);
}

function fetchResults(e) {

  // Assemble the full URL
  console.log(window.location);
  console.log(window.location.toString());
  console.log(window.location.toString().replace(/^[^?]*/, ''));
  let url = window.location.toString().replace(/^[^?]*/, '').replace(/^\?/, '');
  // Use fetch() to make the request to the API
  fetch(url)
    .then((response) => response.json())
    .then((json) => displayResults(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
}
function displayResults(json) {
    player = json.body;
    playerName.textContent = `Name: ${player.displayName}`;
  };

  fetchResults();