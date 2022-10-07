function darkMode() {
    var settingModal = document.getElementById("settingModalDialog");
    var back = document.body;
    var algoCard = document.querySelectorAll(".card-algorithm-type");

    settingModal.classList.toggle("modal-setting-dark");    // settings
    back.classList.toggle("back-dark");                     // background
    for(var i = 0; i < algoCard.length; i++) {              // algorithm type cards
        algoCard[i].classList.toggle("card-algorithm-type-dark");
    }
}

