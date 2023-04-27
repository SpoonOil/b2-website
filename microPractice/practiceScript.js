const button = document.querySelector('.launch');
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".toolList");

hamburger.addEventListener("click", mobileMenu);

button.addEventListener('click', launchGame)

function launchGame() {
    window.open('practice-exec.html', '_blank');
}

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}
