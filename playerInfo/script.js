const submit = document.querySelector('.submit');
const playerName = document.querySelector('.playerName');

submit.addEventListener("click", submitSearch);

function submitSearch(e) {
  fetchResults(e);
}

function fetchResults(e) {

  // Assemble the full URL
  let url = `https://data.ninjakiwi.com/battles2/users/oak_e5536ee85cbba2323d8172cdac616252`;
  // Use fetch() to make the request to the API
  fetch(url)
    .then((response) => response.json())
    .then((json) => displayResults(json))
    .catch((error) => console.error(`Error fetching data: ${error.message}`));
}
function displayResults(json) {
  console.log('hi')
    playerName.textContent = `Name: ${json.body.displayName}`;
  };

  fetchResults();