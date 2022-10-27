/// SETTINGS ----------------------------------------------------------------------------------
function darkMode() {   // enables dark mode
    var settingModal = document.getElementById("settingModalDialog");
    var back = document.body;
    var algoCard = document.querySelectorAll(".card-algorithm-type");
    var grid = document.querySelector("#grid-container");
    var btnOutline = document.querySelectorAll(".btnResize");

    settingModal.classList.toggle("modal-setting-dark");    // settings
    back.classList.toggle("back-dark");                     // background
    algoCard.forEach(element => {
        element.classList.toggle("card-algorithm-type-dark");
    });
    btnOutline.forEach(element => {
        element.classList.toggle("light-outline")
    });
    grid.classList.toggle("grid-dark"); // grid
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

/// MAIN MENU ----------------------------------------------------------------------------------
function sortingGo() {    // animation if sorting go is selected
    $('#algorithmsMenu').fadeTo(500, 0, function() {
        document.querySelector('#algorithmsMenu').style.visibility = 'hidden';
    });
    
    // anime.timeline({
    //     targets: '#searchingAlgorithmsGo, #pathfindingAlgorithmsGo',
    //     translateX: 200,
    //     duration: 500,
    // });

    document.querySelector('#sortingMenu').style.visibility = 'visible';

    $('#sortingMenu').fadeTo(500, 1);
}

function sortingBack() { // animation if sorting back button is selected
    $('#sortingMenu').fadeTo(500, 0, function() {
        document.querySelector('#sortingMenu').style.visibility = 'hidden';
    });
    
    // anime({
    //     targets: '.card-algorithm',
    //     translateX: 200,
    // });

    document.querySelector('#algorithmsMenu').style.visibility = 'visible';

    $('#algorithmsMenu').fadeTo(500, 1);
}

function searchingGo() {    // animation if sorting go is selected
    $('#algorithmsMenu').fadeTo(500, 0, function() {
        document.querySelector('#algorithmsMenu').style.visibility = 'hidden';
    });

    document.querySelector('#searchingMenu').style.visibility = 'visible';

    $('#searchingMenu').fadeTo(500, 1);
}

function searchingBack() { // animation if sorting back button is selected
    $('#searchingMenu').fadeTo(500, 0, function() {
        document.querySelector('#searchingMenu').style.visibility = 'hidden';
    });

    document.querySelector('#algorithmsMenu').style.visibility = 'visible';

    $('#algorithmsMenu').fadeTo(500, 1);
}

function pathfindingGo() {    // animation if sorting go is selected
    $('#algorithmsMenu').fadeTo(500, 0, function() {
        document.querySelector('#algorithmsMenu').style.visibility = 'hidden';
    });

    document.querySelector('#pathfindingMenu').style.visibility = 'visible';

    $('#pathfindingMenu').fadeTo(500, 1);
}

function pathfindingBack() { // animation if sorting back button is selected
    $('#pathfindingMenu').fadeTo(500, 0, function() {
        document.querySelector('#pathfindingMenu').style.visibility = 'hidden';
    });

    document.querySelector('#algorithmsMenu').style.visibility = 'visible';

    $('#algorithmsMenu').fadeTo(500, 1);
}