function darkMode() {   // enables dark mode
    var settingModal = document.getElementById("settingModalDialog");
    var back = document.body;
    var algoCard = document.querySelectorAll(".card-algorithm-type");

    settingModal.classList.toggle("modal-setting-dark");    // settings
    back.classList.toggle("back-dark");                     // background
    for(var i = 0; i < algoCard.length; i++) {              // algorithm type cards
        algoCard[i].classList.toggle("card-algorithm-type-dark");
    }
}

function increaseFontSize() {
    var text = document.querySelectorAll('*');
    
    for(var i = 0; i < text.length; i++) {
        var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
        var currentSize = parseFloat(style);
        text[i].style.fontSize = (currentSize + 1) + 'px';  // current size + 1 px
    }
}

function decreaseFontSize() {
    var text = document.querySelectorAll('*');
    
    for(var i = 0; i < text.length; i++) {
        var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
        var currentSize = parseFloat(style);
        text[i].style.fontSize = (currentSize - 1) + 'px';  // current size + 1 px
    }
}

var zoom = 1;   // original size
var zoomChange = 0.01;   // zoom 20%
function zoomIn() {
    zoom += zoomChange;
    var elements = document.querySelectorAll('*');

    for(var i = 0; i < elements.length; i++) {
        elements[i].style.transform = "scale(" + zoom + ")";
    }
}

function zoomOut() {
    zoom -= zoomChange;
    var elements = document.querySelectorAll('*');

    for(var i = 0; i < elements.length; i++) {
        elements[i].style.transform = "scale(" + zoom + ")";
    }
}
    
function sortingSelected() {
    var fadeSearching = document.querySelector("#searchingAlgorithms");
    var fadePathfinding = document.querySelector("#pathfindingAlgorithms");
    var fadeOutEffect = setInterval(function () {
        if (!fadeSearching.style.opacity) {
            fadeSearching.style.opacity = 1;
        }
        if (fadeSearching.style.opacity > 0) {
            fadeSearching.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }

        if (!fadePathfinding.style.opacity) {
            fadePathfinding.style.opacity = 1;
        }
        if (fadePathfinding.style.opacity > 0) {
            fadePathfinding.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }

        anime({
            targets: '#searchingAlgorithms, #pathfindingAlgorithms',
            translateX: 200
        });
        fadeSearching.style.visibility = "hidden";
        fadePathfinding.style.visibility = "hidden";

    }, 50);
}