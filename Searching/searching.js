import { dragElement, ResizeHandler } from "../js/draggableCard.js"
import { Action } from "../js/Action.js"

let selectedFunction = (new URLSearchParams(window.location.search)).get("func")
let input = []
let actions = []
let x
const speeds = [1, 2, 4]
let speed = 1
let inProgress = false
let playing = false

window.onload = generateBox
window.onresize = generateBox

// instruction modal cookies
if(!Cookies.get('searchVisited')) {
    $('#introModal').modal('show')
    Cookies.set('searchVisited', '1', {expires: 999})
}

document.querySelector("#AnimSpeed").addEventListener("click", function() {
    speed = speeds[(speeds.indexOf(speed)+1)%speeds.length]
    this.innerHTML = `${speed}x`
})

function changeAlgo(func) {
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
}

changeAlgo(selectedFunction)

// Algorithms ----------------------------------------------------------------
// Binary Search iterative approach
function binarySearch(arr, x) {
    let left = 0
    let right = arr.length - 1
    let mid
    let range = []
    while (left <= right) {
        mid = Math.floor(left + (right - left) / 2) // get mid value of subarray
        console.log(mid);
        actions.push(new Comparison([x, arr[mid]]))
        if(x.value == arr[mid].value) {
            actions.push(new Found([arr[mid]]))
            return actions
        } else if(x.value > arr[mid].value) {   // x is on the right side
            range = getRangeToEliminate(range, left, mid)
            actions.push(new EliminateLeft(range))
            left = mid + 1
        } else { // x is on the left side
            range = getRangeToEliminate(range, mid, right)
            actions.push(new EliminateRight(range))
            right = mid - 1
        }
    }
    console.log("not found");
    return actions
}

// linear search algorithm
function linearSearch(arr, x) {
    for (let i = 0; i < arr.length; i++) {
        actions.push(new Comparison([x, arr[i]]))
        if(arr[i].value == x.value) {
            console.log("found")
            actions.push(new Found([arr[i]]))
            return actions
        }
        actions.push(new EliminateSingle([arr[i]]))
    }
    console.log("not found");
    return actions
}

// Animation ----------------------------------------------------------------
async function compareAnimation(actions) {
    let progress = document.querySelector("#Progress-Bar");
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
        let tl = anime.timeline()
        DisplayAnnotation(action.annotation, document.querySelector("#annotation>.card-body>p"))
        action.AnimatePseudocode()
        action.AddToTimeline(tl)
        await tl.finished

        progress.style.width = `${(actions.indexOf(action) + 1) / actions.length * 100}%`
    }

    playing = false    
}

// Action ----------------------------------------------------------------

class Comparison extends Action {
    constructor(targets, line = 1) {
        super(targets.filter(obj => typeof obj !== "undefined"), line)
        Comparison.duration = 999  // duration of comparison at 1x speed
    }

    get duration() {    // duration of comparison based on speed
        return Comparison.duration / speed
    }

    get annotation() {
        if(this.targets.length == 1) {
            return `This is the only element in the list`
        }
        return `Checking if ${this.targets[0].value} is equal to ${this.targets[1].value}`
    }

    get Animation() {
        this.target = [this.targets[1]] // get singleton in array form
        const animations = this.target.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#84A98C",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class Found extends Action {
    constructor(targets, line = 2) {
        super(targets, line)
        Found.duration = 1
    }

    get annotation() {
        return `${this.targets[0].value} has been found.`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#F26419", 
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class EliminateSingle extends Action {
    constructor(targets, line = 3) {
        super(targets, line)
        EliminateSingle.duration = 1
    }

    get annotation() {
        return `${x.value} does not equal ${this.targets[0].value}`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#696464",
                color: "#FFFFFF",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class EliminateLeft extends Action {
    constructor(targets, line = 4) {
        super(targets, line)
        EliminateLeft.duration = 1
    }

    get annotation() {
        return `${x.value} > ${this.targets[this.targets.length - 1].value}<br>
        ${x.value} is in the right side.<br>
        Elimitate the left side.<br>`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#696464",
                color: "#FFFFFF",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

class EliminateRight extends Action {
    constructor(targets, line = 5) {
        super(targets, line)
        EliminateRight.duration = 1
    }

    get annotation() {
        return `${x.value} < ${this.targets[this.targets.length - 1].value}<br>
        ${x.value} is in the left side.<br>
        Elimitate the right side.<br>`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
                targets: document.querySelector(`${element.id}`),
                backgroundColor: "#696464",
                color: "#FFFFFF",
                duration: this.duration
            }
        })

        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            if(index == 0) {
                tl.add(animation)
            } else {
                tl.add(animation, `-=${this.duration}`)
            }
        })
    }
}

// Functions ----------------------------------------------------------------
function DisplayAnnotation(msg, element) {
    element.innerHTML = msg
}

function getRangeToEliminate(range, start, end) {
    range = []
    for(let i = start; i <= end; i++) {
        range.push(input[i])
    }
    printArr(range)
    return range
}

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
    generateBox()
    if(inProgress) {
        console.log("Animation in progress, can't play")
        return
    }
    inProgress = true
    actions = []
    getFindValue()
    let comparisons = selectedFunction(input, x)
    compareAnimation(comparisons)
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