function darkMode() {
    var settingModal = document.getElementById("settingModalDialog");
    var back = document.body;
    var algoCard = document.getElementsByClassName("card-algorithm-type");

    settingModal.classList.toggle("modal-setting-dark");
    back.classList.toggle("back-dark");
    for(var i = 0; i < algoCard.length; i++) {
        algoCard[i].classList.toggle("card-algorithm-type-dark");
    }
}