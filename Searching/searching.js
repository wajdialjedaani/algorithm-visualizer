import { dragElement, ResizeHandler } from "../js/draggableCard.js"
import { Action } from "../js/Action.js"
import { Alert } from "../js/Alert.js"
import { CheckFirstVisit } from "../js/Cookies.js"
import anime from "../js/anime.es.js"
import { PageAlgorithm, DisplayAnnotation } from "../js/SetAlgorithm.js";
import { AnimationController } from "../js/AnimationController.js";

//let selectedFunction = (new URLSearchParams(window.location.search)).get("func")
let input = []
let x
let inProgress = false
let playing = false

const pageAlgorithm = new PageAlgorithm()

window.onload = generateBox
window.onresize = generateBox
//Initialize the dropdown menu buttons
document.getElementById("linearsearch").onclick = pageAlgorithm.changeAlgo.bind(pageAlgorithm)
document.getElementById("binarysearch").onclick = pageAlgorithm.changeAlgo.bind(pageAlgorithm)

CheckFirstVisit('searchVisited')

document.querySelector("#AnimSpeed").addEventListener("click", function() {
    AnimationController.animationSpeed = AnimationController.speeds[(AnimationController.speeds.indexOf(AnimationController.animationSpeed)+1)%AnimationController.speeds.length]
    this.innerHTML = `${AnimationController.animationSpeed}x`
})

/*
function changeAlgo(func) {
    if(typeof func !== "string" && typeof this !== "undefined") {
        func = this.id
    }
    let pseudocode
    let text
    if(func == "binarysearch") {
        text = `Binary search compares the <b>target value to the middle element</b> of the array. 
        If they are <b>not equal</b>, the half where target cannot be in is eliminated and the search continues on the remaining half repeating this until the target value is found. 
        If the search ends with the remaining half being empty, the target is <b>not</b> in the array.`
        pseudocode = `binarySearch(arr, x, low, high) <br>
        &emsp;repeat till low = high <br>
        &emsp;&emsp;mid = (low + high)/2 <br>
        <span id="pseudo1">&emsp;&emsp;if (x == arr[mid])</span><br>
        <span id="pseudo2">&emsp;&emsp;&emsp;return mid</span><br>
        <span id="pseudo1">&emsp;&emsp;else if (x > arr[mid])</span><br>
        <span id="pseudo4">&emsp;&emsp;&emsp;low = mid + 1</span><br>
        <span id="pseudo1">&emsp;&emsp;else</span><br>
        <span id="pseudo5">&emsp;&emsp;&emsp;high = mid - 1</span><br>`
        selectedFunction = binarySearch
        document.querySelector("#Header").textContent = "Binary Search"
    }
    else if(func == "linearsearch") {
        text = `Linear Search <b>sequentially</b> checks each element of the list until a <b>match is found</b> or until the <b>entire list has been searched</b>.`
        pseudocode = `linearSearch(arr, x) <br>
        &emsp;loop till end of array <br>
        <span id="pseudo1">&emsp;&emsp;if (x[i] == current value)</span><br>
        <span id="pseudo2">&emsp;&emsp;&emsp;return i</span><br>
        &emsp;&emsp;else<br>
        <span id="pseudo3">&emsp;&emsp;&emsp;eliminate</span><br>`
        selectedFunction = linearSearch
        document.querySelector("#Header").textContent = "Linear Search"
    }
    DisplayAnnotation(pseudocode, document.querySelector("#pseudocode>.card-body>p"))
    DisplayAnnotation(text, document.querySelector("#annotation>.card-body>p"))
}*/

pageAlgorithm.changeAlgo((new URLSearchParams(window.location.search)).get("func") || "LinearSearch")

// Algorithms ----------------------------------------------------------------
// Binary Search iterative approach

// linear search algorithm

// Animation ----------------------------------------------------------------
async function compareAnimation(actions) {
    let progress = document.querySelector("#Progress-Bar");
    let tl
    document.querySelector("#PlayPause").onclick = function() {
        if(typeof tl === "undefined" || !inProgress) {
            console.log("No animation playing")
            return
        }
        if(playing) {
            console.log("first")
            playing = false
            tl.pause()
            this.firstChild.setAttribute("src", "../Assets/play-fill.svg")
        }
        else {
            console.log("second")
            playing = true
            tl.play()
            this.firstChild.setAttribute("src", "../Assets/pause-fill.svg")
        }
    }

    playing = true

    for(let action of actions) {
        tl = anime.timeline()
        DisplayAnnotation(action.annotation, document.querySelector("#annotation>.card-body>p"))
        action.AnimatePseudocode()
        action.AddToTimeline(tl)
        await tl.finished

        progress.style.width = `${(actions.indexOf(action) + 1) / actions.length * 100}%`
    }

    playing = false    
}

// Action ----------------------------------------------------------------


// Functions ----------------------------------------------------------------

// gets input and splits it into an array
function getInput() {    
    let max = window.innerWidth < 768 ? 15 : 25
    max = window.innerWidth < 300 ? 10 : max
    var inputString = document.getElementById('input').value
    input = inputString.split(", ")

    input.forEach((val, i, arr) => {arr[i] = {
        value: Number(val),
        id: `#arrBox${val}`   // id="arrBoxi"
    }})
    input.sort((a,b) => a.value - b.value)
    let unique = [...new Map(input.map((m) => [m.id, m])).values()]
    console.log(unique);
    return unique.length > max ? unique.slice(0, max) : unique
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
    
    generateBox()
}

function getFindValue() {
    x = Number(document.getElementById('FindValue').value)
    x = {
        value: x,
        id: `#arrBox${x}`
    }
    return x
}

// removes existing array
function removeBox() {
    var box = document.querySelectorAll('.arrBox')
    box.forEach(element => element.remove())
}

function generateBox() {
    removeBox()
    input = getInput()
    let container = document.querySelector('#arrCanvas')
    container.style.setProperty("--columns", input.length)
    container.style.setProperty("--width", document.querySelector('#arrCanvas').clientWidth / input.length)
    for(let i = 0; i < input.length; i++) {
        let arrBox = document.createElement('div')
        let arrBoxID = 'arrBox' + input[i].value
        arrBox.innerHTML = input[i].value
        arrBox.classList.add('arrBox')
        arrBox.setAttribute('id', arrBoxID)
        arrBox.style.setProperty('--position', `${i * document.querySelector('#arrCanvas').clientWidth / input.length}`)
        arrBox.style.setProperty('--translation', 0)
        container.appendChild(arrBox)
    }
}

// prints array to console
function printArr(arr) { 
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i])
    }
}

function start() {
    if(inProgress) {
        console.log("Animation in progress, can't play")
        return
    }
    generateBox()
    inProgress = true
    getFindValue()
    let actions = pageAlgorithm.selectedFunction(input, x)
    compareAnimation(actions)
    .then(function(value) {
        document.querySelector("#start").style.display = "none"
        document.querySelector("#reset").style.display = "inline"
    })
    // .catch((error) => {console.log("Error in start()")})
    .finally( function() {
        inProgress = false
    })
}

document.querySelectorAll(".draggable").forEach((element) => {dragElement(element)})
document.querySelectorAll(".resizer").forEach((element) => {ResizeHandler(element)})

document.querySelector('#start').addEventListener('click', function() {
    if(document.querySelector("#FindValue").value == "") {
        $("#warningModal").modal("show")
    } else {
        start()
    }
})
document.querySelector('#start1').addEventListener('click', function() {
    if(document.querySelector("#FindValue").value == "") {
        $("#warningModal").modal("show")
    } else {
        start()
    }
})
document.querySelector('#FindValue').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        e.preventDefault()
        if(document.querySelector("#FindValue").value == "") {
            $("#warningModal").modal("show")
        } else {
            document.querySelector('#start').click()
        }
    }
})
document.querySelector('#getNewInput').addEventListener('click', generateBox)
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
document.querySelector("#reset").addEventListener("click", function() {
    generateBox()
    document.querySelector("#Progress-Bar").style.width = "0%"
    document.querySelector("#reset").style.display = "none"
    document.querySelector("#start").style.display = "inline"
    inProgress = false;
})