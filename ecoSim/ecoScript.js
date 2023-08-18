const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".toolList");
const closeButton = document.querySelector(".warning-close-button")
const banner = document.querySelector(".warning-banner-container")
closeButton.addEventListener("click", closeBanner);
hamburger.addEventListener("click", mobileMenu);

function closeBanner() {
    banner.classList.add("hidden")
}
function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}
