let fontIncrease = 0    // positive means there is a change; negative is an offset if there is a combo of increase and decrease
let fontDecrease = 0

/// SETTINGS ----------------------------------------------------------------------------------
function darkMode() {   // enables dark mode

    var settingModal = document.getElementById("settingModalDialog")
    var back = document.body
    var algoCard = document.querySelectorAll(".card-algorithm-type")
    var btnOutline = document.querySelectorAll(".btnResize")
    var introModal = document.querySelector("#introModal")
    var grid = document.querySelector("#grid-container")
    var draggable = document.querySelectorAll(".draggable")
    var arrBar = document.querySelectorAll(".arrBar")
    var inputTab = document.querySelector(".input-tab")
    var customInput = document.querySelector(".customInputs")

    settingModal.classList.toggle("modal-setting-dark")    // settings
    back.classList.toggle("back-dark")                    // background
    algoCard.forEach(element => {
        element.classList.toggle("card-algorithm-type-dark")
    })
    btnOutline.forEach(element => {
        element.classList.toggle("light-outline")
    })
    if(introModal) {    // 
        introModal.classList.toggle("introModal-dark")
    }
    if(grid) {
        grid.classList.toggle("grid-dark") // grid
    }
    if(draggable) {
        draggable.forEach(element => {
            element.classList.toggle("draggable-dark")
        })
    }
    if(arrBar) {
        arrBar.forEach(element => {
            element.classList.toggle("arrBar-dark")
        })
    }
    if(inputTab) {
        inputTab.classList.toggle("input-tab-dark")
        customInput.classList.toggle("customInputs-dark")
    }
}

function increaseFontSize() {
    var text = document.querySelectorAll('*');
    
    for(var i = 0; i < text.length; i++) {
        var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
        var currentSize = parseFloat(style);
        text[i].style.fontSize = (currentSize + 1) + 'px';  // current size + 1 px
    }
    fontIncrease++
    fontDecrease--
}

function decreaseFontSize() {
    var text = document.querySelectorAll('*'); 
    for(var i = 0; i < text.length; i++) {
        var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
        var currentSize = parseFloat(style);
        text[i].style.fontSize = (currentSize - 1) + 'px';  // current size + 1 px
        
    }
    fontDecrease++
    fontIncrease--
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

function resetSettings() {
    var text = document.querySelectorAll('*');
    console.log("Font increased by: " + fontIncrease);
    console.log("Font decreased by: " + fontDecrease);
    if (fontIncrease > 0) {
        for (let i = 0; i < text.length; i++) {
            var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
            var currentSize = parseFloat(style);
            text[i].style.fontSize = (currentSize - fontIncrease) + 'px';   // subtracts px by how many times it increased
        }
        
    } else if(fontDecrease > 0) {
        for (let i = 0; i < text.length; i++) {
            var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
            var currentSize = parseFloat(style);
            text[i].style.fontSize = (currentSize + fontDecrease) + 'px';   // subtracts px by how many times it increased
        }
    }
    fontDecrease = 0
    fontIncrease = 0

    if(dark) {
        document.querySelector("#darkModeSwitch").click()
    }
}

/// MAIN MENU ----------------------------------------------------------------------------------
function menuChange() {
    let menuBtn = document.querySelectorAll(".menu-button")
    menuBtn.forEach(element => {
        element.toggleAttribute('disabled')
    })

    setTimeout(function(){
        menuBtn.forEach(element => {
            element.toggleAttribute('disabled')
        })
    },500)
}

function sortingGo() {    // animation if sorting go is selected
    menuChange()
    $('#algorithmsMenu').fadeTo(500, 0, function() {
        document.querySelector('#algorithmsMenu').style.visibility = 'hidden';
    });

    document.querySelector('#sortingMenu').style.visibility = 'visible';

    $('#sortingMenu').fadeTo(500, 1);
}

function sortingBack() { // animation if sorting back button is selected
    menuChange()
    $('#sortingMenu').fadeTo(500, 0, function() {
        document.querySelector('#sortingMenu').style.visibility = 'hidden';
    });

    document.querySelector('#algorithmsMenu').style.visibility = 'visible';
    
    $('#algorithmsMenu').fadeTo(500, 1);
}

function searchingGo() {    // animation if sorting go is selected
    menuChange()
    $('#algorithmsMenu').fadeTo(500, 0, function() {
        document.querySelector('#algorithmsMenu').style.visibility = 'hidden';
    });

    document.querySelector('#searchingMenu').style.visibility = 'visible';

    $('#searchingMenu').fadeTo(500, 1);
}

function searchingBack() { // animation if sorting back button is selected
    menuChange()
    $('#searchingMenu').fadeTo(500, 0, function() {
        document.querySelector('#searchingMenu').style.visibility = 'hidden';
    });

    document.querySelector('#algorithmsMenu').style.visibility = 'visible';

    $('#algorithmsMenu').fadeTo(500, 1);
}

function pathfindingGo() {    // animation if sorting go is selected
    menuChange()
    $('#algorithmsMenu').fadeTo(500, 0, function() {
        document.querySelector('#algorithmsMenu').style.visibility = 'hidden';
    });

    document.querySelector('#pathfindingMenu').style.visibility = 'visible';

    $('#pathfindingMenu').fadeTo(500, 1);
}

function pathfindingBack() { // animation if sorting back button is selected
    menuChange()
    $('#pathfindingMenu').fadeTo(500, 0, function() {
        document.querySelector('#pathfindingMenu').style.visibility = 'hidden';
    });

    document.querySelector('#algorithmsMenu').style.visibility = 'visible';

    $('#algorithmsMenu').fadeTo(500, 1);
}

window.addEventListener('load', function() {
    if(!Cookies.get('darkMode')) { //If no cookie, default to light mode
        console.log("no cookie. creating cookie rn")
        Cookies.set('darkMode', '0', {expires: 999, sameSite: 'strict'})
    }
    else if(Cookies.get('darkMode') === '1') { //Cookie says dark mode
        console.log("darkmode")
        document.querySelector("#darkModeSwitch").toggleAttribute('checked')
        darkMode()
    }
    else
    {
        console.log('lightmode')
    }
})