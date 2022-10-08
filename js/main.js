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

function increaseFontSize(increaseFactor) {
    var text = document.querySelectorAll('*');
    
    for(var i = 0; i < text.length; i++) {
        var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
        var currentSize = parseFloat(style);
        text[i].style.fontSize = (currentSize + increaseFactor) + 'px';
    }
}

function decreaseFontSize(decreaseFactor) {
    var text = document.querySelectorAll('*');
    
    for(var i = 0; i < text.length; i++) {
        var style = window.getComputedStyle(text[i]).getPropertyValue('font-size');
        var currentSize = parseFloat(style);
        text[i].style.fontSize = (currentSize - decreaseFactor) + 'px';
    }
} 

function sortingSelected() {
    anime({
        targets: '#searchingCard, #pathfindingCard',
        translateX: 1000,
        duration: 100,
    });
}