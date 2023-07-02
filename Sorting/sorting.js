import { dragElement, ResizeHandler } from "../js/draggableCard.js"
import { Alert } from "../js/Alert.js"
import { CheckFirstVisit } from "../js/Cookies.js"
import { PageAlgorithm, DisplayAnnotation } from "../js/SetAlgorithm.js";
import { AnimationController } from "../js/AnimationController.js";

let input = []
const alertContainer = document.getElementById('alertContainer')

const pageAlgorithm = new PageAlgorithm()
const animationController = new AnimationController()

window.onload = generateBars
window.onresize = generateBars

//Initialize dropdown menu buttons
document.querySelectorAll(".InsertionSort").forEach((element) => {element.onclick=ChangeAlgorithm})
document.querySelectorAll(".SelectionSort").forEach((element) => {element.onclick=ChangeAlgorithm})
document.querySelectorAll(".BubbleSort").forEach((element) => {element.onclick=ChangeAlgorithm})
document.querySelectorAll(".QuickSort").forEach((element) => {element.onclick=ChangeAlgorithm})

function ChangeAlgorithm(event) {
    if(animationController.IsInProgress()) {
        animationController.CancelAnimation()
    }
    //pageAlgorithm.changeAlgo.call(pageAlgorithm, event)
    pageAlgorithm.changeAlgo(event)

    //Reset call is done after a 0ms timeout to ensure it runs AFTER all promises relating to the animation resolve.
    setTimeout(()=>{Reset()}, 0)
}


//Initialize sorting-specific buttons
document.querySelector("#randomNumbers").addEventListener('click', randomInput)

CheckFirstVisit('sortVisited')

pageAlgorithm.changeAlgo((new URLSearchParams(window.location.search)).get("func") || "insertionsort")

// gets input and splits it into an array
function getInput() {
    let max = window.innerWidth < 768 ? 15 : 25
    max = window.innerWidth < 300 ? 10 : max
    var inputString = document.getElementById('input').value
    input = inputString.split(", ")
    input.forEach((val, i, arr) => {
        if(Number.isNaN(Number(val))) {
            throw new Error("Something went wrong with the input - check to make sure you put all necessary commas and only inserted numbers.")
        }
        arr[i] = {
        value: Number(val),
        id: `#arrBar${i}`
    }})
    return input.length > max ? input.slice(0, max) : input
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function randomInput() {
    input = []
    let inputString
    let length = getRandomIntInclusive(5, 20)
    
    inputString = getRandomIntInclusive(1, 100) + ", "
    for (let i = 0; i < length - 2; i++) {
        inputString += getRandomIntInclusive(1, 100) + ", "
    }
    inputString += getRandomIntInclusive(1, 100)

    document.querySelector("#input").value = inputString
    document.querySelector("#reset").style.display = "none"
    document.querySelector("#start").style.display = "inline"
    
    generateBars()
}

// generates the bars, can be used with user inputs
function generateBars() {
    try {
        input = getInput()
    }
    catch(error) {
        throw error
    }
    removeBars()
    let container = document.querySelector('#arrCanvas')
    container.style.setProperty("--columns", input.length)
    container.style.setProperty("--width", document.querySelector('#arrCanvas').clientWidth / input.length)
    let max = Math.max(...input.map(o => o.value))
    let maxHeight = document.querySelector('#arrCanvas').offsetHeight

    for(let i = 0; i < input.length; i++) {
        let arrBar = document.createElement('div')
        let arrBarID = 'arrBar' + i
        arrBar.classList.add('arrBar')
        if((Cookies.get('darkMode') === '1') && (!arrBar.classList.contains('arrBar-dark'))) {  // if dark mode and arrBar does not have dark, add dark
            arrBar.classList.add('arrBar-dark')
            console.log("true");
        }
        arrBar.setAttribute('id', arrBarID)
        arrBar.style.setProperty('--position', `${i * document.querySelector('#arrCanvas').clientWidth / input.length}`)
        arrBar.style.setProperty('--translation', 0)
        arrBar.style.height = (maxHeight * (input[i].value / max)) + 'px'
        arrBar.innerHTML = input[i].value
        arrBar.style.lineHeight = (parseFloat(arrBar.style.height.replace('px', '')) * 2 + 20) + 'px'
        container.appendChild(arrBar)
    }
}

// removes existing bars
function removeBars() { 
    var bars = document.querySelectorAll('.arrBar')
    bars.forEach(element => element.remove())
}

// highlights and swaps bars
async function swapAnimation(actions) {
    animationController.playing = true
    await animationController.PlayAllAnimations({progressBar: document.querySelector("#Progress-Bar"), cancel: document.querySelector("#cancel")})
    animationController.playing = false
}

// prints array to console
/*
function printArrValue(arr) { 
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i].value)
    }
}

function printArr(arr) {
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i])
    }
}
*/

function start() {
    if(animationController.inProgress) {
        Alert(alertContainer, "Animation in progress, can't play", 'warning')
        return
    }
    animationController.inProgress = true

    //Change Go button to Cancel button
    document.querySelector("#start").style.display = "none"
    document.querySelector("#cancel").style.display = "inline"

    animationController.animations = pageAlgorithm.selectedFunction(input, 0, input.length - 1);
    swapAnimation(animationController.animations)
    .then(function(value) {
        document.querySelector("#cancel").style.display = "none"
        document.querySelector("#reset").style.display = "inline"
    })
    .catch((error) => {console.log(error.message)})
    .finally( function() {
        animationController.inProgress = false
    })
}

function Reset() {
    generateBars()
    document.querySelector("#Progress-Bar").style.width = "0%"
    document.querySelector("#reset").style.display = "none"
    document.querySelector("#start").style.display = "inline"
    animationController.inProgress = false;
}

// Draggable ----------------------------------------------------------------
document.querySelectorAll(".draggable").forEach((element) => {dragElement(element)})
document.querySelectorAll(".resizer").forEach((element) => {ResizeHandler(element)})
// ----------------------------------------------------------------


// Bottom Bar Elements --------------------------------------------
document.querySelector('#start').addEventListener('click', start)
document.querySelector('#getNewInput').addEventListener('click', function() {
    try {
    generateBars()
    }
    catch(error) {
        Alert(alertContainer, error.message, 'danger')
    }
})
document.querySelector('#input').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {    
        e.preventDefault()
        if(document.getElementById('input').value == "") {
            document.querySelector('#randomNumbers').click()
        } else {
            document.querySelector('#getNewInput').click()
        }
    }
})
document.querySelector("#AnimSpeed").addEventListener("click", function() {
    animationController.speed = animationController.speeds[(animationController.speeds.indexOf(animationController.speed)+1)%animationController.speeds.length]
    this.innerHTML = `${animationController.speed}x`
})
document.querySelector("#reset").addEventListener("click", Reset)
//document.querySelector("#cancel").addEventListener("click", () => {
//    if(!animationController.inProgress) {
//        Alert(alertContainer, "No in-progress animation to cancel.", "warning")
//        return
//    }
//    animationController.CancelAnimation()
//})
document.querySelector("#PlayPause").onclick = function() {
    if(typeof animationController.currentAnim === "undefined" || !animationController.inProgress) {
        Alert(alertContainer, "No animation playing", 'warning')
        return
    }

    //Play or pause depending on current animation state, then toggle button state
    if(animationController.playing) {
        animationController.playing = false
        animationController.Pause()
        this.firstChild.setAttribute("src", "../Assets/play-fill.svg")
    }
    else {
        animationController.playing = true
        animationController.Play()
        this.firstChild.setAttribute("src", "../Assets/pause-fill.svg")
    }
}
// ----------------------------------------------------------------