// Don't play the effect if the user has selected the prefer-reduced-motion setting on their device
if (isAprilFools() && !checkReducedMotion()) {
    document.querySelector("body").insertAdjacentHTML("beforeend", `
        <style>
            body {
                transform: rotate(180deg);
            }
        </style>
    `)
    setTimeout(() => {
        document.querySelector("body").insertAdjacentHTML("beforeend", `
            <style>
                body {
                    transition: 1s
                }
            </style>
        `)
        document.querySelector("body").insertAdjacentHTML("beforeend", `
            <style>
                body {
                    transform: rotate(0deg);
                }
            </style>
        `)
    }, 1000);
}

function isAprilFools() {
    return new Date().getMonth() === 3 && new Date().getDate() === 1
}

function checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}