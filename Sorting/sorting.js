import { dragElement, ResizeHandler } from "../js/draggableCard.js"
import { Action } from "../js/Action.js"
import { Alert } from "../js/Alert.js"
import { CheckFirstVisit } from "../js/Cookies.js"
import anime from "../js/anime.es.js"
import { PageAlgorithm, DisplayAnnotation } from "../js/SetAlgorithm.js";
import { AnimationController } from "../js/AnimationController.js";

let input = []
let inProgress = false
let playing = false
const alertContainer = document.getElementById('alertContainer')
const pageAlgorithm = new PageAlgorithm()

window.onload = generateBars
window.onresize = generateBars
//Initialize dropdown menu buttons
document.querySelectorAll(".InsertionSort").forEach(element => element.onclick=pageAlgorithm.changeAlgo.bind(pageAlgorithm))
document.querySelectorAll(".SelectionSort").forEach(element => element.onclick=pageAlgorithm.changeAlgo.bind(pageAlgorithm))
document.querySelectorAll(".BubbleSort").forEach(element => element.onclick=pageAlgorithm.changeAlgo.bind(pageAlgorithm))
document.querySelectorAll(".QuickSort").forEach(element => element.onclick=pageAlgorithm.changeAlgo.bind(pageAlgorithm))

//Initialize sorting-specific buttons
document.querySelector("#randomNumbers").addEventListener('click', randomInput)

CheckFirstVisit('sortVisited')
/*
function changeAlgo(func) {
    if(typeof func !== "string" && typeof this !== "undefined") {
        func = this.id
    }
    let text
    let pseudo
    if(func == "insertionsort") {
        selectedFunction = insertionSort
        document.querySelector("#Header").textContent = "Insertion Sort"
        text = `Insertion sort treats an array as two subarrays: one <b>sorted</b> and one <b>unsorted.</b> The sorted subarray begins with just the <b>first element</b>, 
        so it is "sorted" from the start. It then iterates through the list, selecting the first element of the <b>unsorted subarray</b> and 'inserting' it into the proper spot of the 
        sorted subarray. Once the final element is inserted, the list is sorted.`
        pseudo = `i = 1<br>
        while i < length(arr)<br>
        &emsp;j = i<br>
        <span id="pseudo1">&emsp;while j > 0 and arr[j-1] > arr[j]</span><br>
        <span id="pseudo2">&emsp;&emsp;swap arr[j] and arr[j-1]</span><br>
        &emsp;&emsp;j = j - 1<br>
        <span id="pseudo3">&emsp;i = i + 1</span>`
    }
    else if (func == "selectionsort") {
        selectedFunction = selectionSort
        document.querySelector("#Header").textContent = "Selection Sort"
        text = `Selection sort treats an array as two subarrays: one <b>sorted</b> and one <b>unsorted.</b> The sorted subarray begins <b>empty</b>.
        The algorithm iterates through the <b>unsorted subarray</b> and finds the <b>smallest element</b>. It then moves this element to the <b>front</b> of the unsorted array,
        now treating the sorted subarray as though it grew.`
        pseudo = `
        for i = 1 to length(arr) - 1<br>
        &emsp;min = i<br>
        &emsp;for j = i+1 to length(arr)<br> 
        <span id="pseudo1">&emsp;&emsp;if arr[j] < arr[min]<br>
        &emsp;&emsp;min = j;<br></span>
        &emsp;if indexMin != i<br>
        <span id="pseudo2">&emsp;&emsp;swap arr[min] and arr[i]<br></span>`
    }
    else if (func == "bubblesort") {
        selectedFunction = bubbleSort
        document.querySelector("#Header").textContent = "Bubble Sort"
        text = `Bubble sort repeatedly iterates through a list <b>one by one</b>, comparing and swapping elements as it goes. By the end of the <b>first iteration</b>, the final element will be the largest.
        Bubble sort then repeats the process, this time placing the second-largest number in the second-last spot. Repeating this process <b>n</b> (length of the list) times guarantees
        a sorted array.`
        pseudo = `
        for i = 0 to length(arr)<br>
        <span id="pseudo1">&emsp;if arr[i] > arr[i+1]<br></span>
        <span id="pseudo2">&emsp;&emsp;swap arr[i] and arr[i+1]<br></span>`
    }
    else if (func == "quicksort") {
        selectedFunction = quickSort
        document.querySelector("#Header").textContent = "Quick Sort"
        text = `Quick sort is a <b>divide-and-conquer</b> algorithm. It chooses an element to act as a 'pivot', splitting the rest of the array into two subarrays based on if
        the elements are smaller or larger than the pivot. It repeats this <b>recursively</b> until the arrays are one element and, effectively, sorted.`
        pseudo = `
        pivot = arr[right]<br>
        i = left-1<br>
        for j = low to right-1<br>
        <span id="pseudo1">&emsp;if arr[j] < pivot<br></span>
        &emsp;&emsp;i++<br>
        <span id="pseudo21">&emsp;&emsp;swap arr[i] and arr[j]<br></span>
        <span id="pseudo22">swap arr[i+1] and arr[high]<br></span>`
    }
    DisplayAnnotation(text, document.querySelector("#annotation>.card-body>p"))
    DisplayAnnotation(pseudo, document.querySelector("#pseudocode>.card-body>p"))
}*/

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
    let progress = document.querySelector("#Progress-Bar")
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
    for (let action of actions) {
        tl = anime.timeline()
        DisplayAnnotation(action.annotation, document.querySelector("#annotation>.card-body>p"))
        action.AnimatePseudocode()
        action.AddToTimeline(tl)
        await tl.finished

        progress.style.width = `${(actions.indexOf(action) + 1) / actions.length * 100}%`
    }
    playing = false
}

// prints array to console
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

function start() {
    if(inProgress) {
        console.log("Animation in progress, can't play")
        return
    }
    inProgress = true
    let swaps = pageAlgorithm.selectedFunction(input, 0, input.length - 1);
    swapAnimation(swaps)
    .then(function(value) {
        document.querySelector("#start").style.display = "none"
        document.querySelector("#reset").style.display = "inline"
    })
    .catch((error) => {console.log(error.message)})
    .finally( function() {
        inProgress = false
    })
}

// Draggable ----------------------------------------------------------------
document.querySelectorAll(".draggable").forEach((element) => {dragElement(element)})
document.querySelectorAll(".resizer").forEach((element) => {ResizeHandler(element)})
// ----------------------------------------------------------------

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
    AnimationController.animationSpeed = AnimationController.speeds[(AnimationController.speeds.indexOf(AnimationController.animationSpeed)+1)%AnimationController.speeds.length]
    this.innerHTML = `${AnimationController.animationSpeed}x`
})
document.querySelector("#reset").addEventListener("click", function() {
    generateBars()
    document.querySelector("#Progress-Bar").style.width = "0%"
    document.querySelector("#reset").style.display = "none"
    document.querySelector("#start").style.display = "inline"
    inProgress = false;
})
