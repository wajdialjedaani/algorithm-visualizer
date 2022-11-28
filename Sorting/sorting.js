let input = []
let actions = []
let selectedFunction = (new URLSearchParams(window.location.search)).get("func") || insertionSort
const speeds = [1, 2, 4]
let speed = 1
let inProgress = false
let playing = false

window.onload = generateBars
window.onresize = generateBars

if(!Cookies.get('sortVisited')) {
    $('#introModal').modal('show')
    Cookies.set('sortVisited', '1', {expires: 999})
}

// TODO: implement pseudocode change; refer pathfind.js
function changeAlgo(func) {
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
}
changeAlgo(selectedFunction)

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

// SORTING ALGORITHMS------------------------------------------------------------------------------------------------------------------------------------

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// insertion sort algorithm
function insertionSort(arr) {
    let j, current, i
    for(i = 1; i < arr.length; i++) {
        current = arr[i]
        j = i - 1
        actions.push(new Sorted(arr[j]))
        actions.push(new Comparison([arr[j], current]))
        while(j >= 0 && arr[j].value > current.value) { // checks if j is outside of array and compares j position value with current
            actions.push(new Swap([current, arr[j]]))
            //actions.push(new Sorted(arr[j]))

            arr[j + 1] = arr[j]
            j--

            actions.push(new Comparison([arr[j], current]))
        }
        arr[j + 1] = current   // once while is false, the last j position is current
        actions.push(new Sorted(current))
    }
    //printArr(actions)
    return actions
}

// BUG: swaps are not correct
// selection sort algorithm
function selectionSort(arr) {
    let min_ind

    for(let i = 0; i < (arr.length - 1); i++) {
        min_ind = i
        
        for(let j = i + 1; j < arr.length; j++) {
            actions.push(new Comparison([arr[j], arr[min_ind]]))
            if(arr[j].value < arr[min_ind].value) {
                min_ind = j
            }
        }

        // swap
        actions.push(new Swap([arr[min_ind], arr[i]]))
        swap(arr, min_ind, i)
        // temp = arr[min_ind]
        // arr[min_ind] = arr[i]
        // arr[i] = temp
    }
    printArr(actions)
    return actions
}

// bubble sort algorithm
function bubbleSort(arr) {
    for(let i = 0; i < arr.length - 1; i++) {
        for(let j = 0; j < arr.length - i - 1; j++) {
            actions.push(new Comparison([arr[j], arr[j + 1]]))
            if(arr[j].value > arr[j + 1].value) {
                // swap
                actions.push(new Swap([arr[j], arr[j + 1]]))
                swap(arr, j, j + 1)
                // temp = arr[j]
                // arr[j] = arr[j + 1]
                // arr[j + 1] = temp
            }
        }
    }
    printArr(actions)
    return actions
}

// quick sort algorithm
function quickSort(arr, low, high) {
    if(low < high) {
        let pivot = Partition(arr, low, high, actions)

        quickSort(arr, low, pivot - 1)
        quickSort(arr, pivot + 1, high)
    }
    printArr(actions)
    return actions
}

function Partition(arr, low, high, actions) {
    let pivot = arr[high].value
    actions.push(new PivotToggle(arr[high]))
    actions.push(new Subarray(arr.slice(low, high)))
    let i = (low - 1)

    for (let j = low; j <= high - 1; j++) {
        actions.push(new Comparison([arr[j], arr[high]]))
        if(arr[j].value < pivot) {
            i++
            actions.push(new Swap([arr[i], arr[j]], 21))
            swap(arr, i, j)
        }   
    }
    actions.push(new Swap([arr[i + 1], arr[high]], 22))
    actions.push(new PivotToggle(arr[high]))
    actions.push(new Subarray(arr.slice(low, high)))
    swap(arr, i + 1, high)
    return (i + 1)
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------

// highlights and swaps bars
async function swapAnimation(actions) {
    progress = document.querySelector("#Progress-Bar")
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
    for (action of actions) {
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
    actions = []
    let swaps = selectedFunction(input, 0, input.length - 1);
    swapAnimation(swaps)
    .then(function(value) {
        document.querySelector("#start").style.display = "none"
        document.querySelector("#reset").style.display = "inline"
    })
    .catch((error) => {console.log("Error in start()")})
    .finally( function() {
        inProgress = false
    })
}

class Action {
    constructor(targets, line) {
        this.targets = targets
        this.line = `#pseudo${line}`
    }

    get duration() {
        return 1000
    }

    AnimatePseudocode() {
        console.log(this.line)
        anime({
            targets: action.line,
            backgroundColor: [{value: "#000000", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "backgroundColor"), duration: 1}],
            color: [{value: "#FFFFFF", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${this.line}`), "color"), duration: 1}]
        })
    }
}

class Swap extends Action {
    constructor(targets, line=2) {
        super(targets, line)
        Swap.duration = 1000
    }

    get annotation() {
        return `${this.targets[0].value < this.targets[1].value ? this.targets[0].value : this.targets[1].value} is less than 
        ${this.targets[0].value > this.targets[1].value ? this.targets[0].value : this.targets[1].value}, so we will swap them.`
    }

    get duration() {
        return Swap.duration / speed
    }

    get Animation() {
        let selected1 = document.querySelector(`${this.targets[0].id}`)
        let selected2 = document.querySelector(`${this.targets[1].id}`)
        let currentPos1 = Number(selected1.style.getPropertyValue('--position')) + Number(selected1.style.getPropertyValue('--translation'))
        let currentPos2 = Number(selected2.style.getPropertyValue('--position')) + Number(selected2.style.getPropertyValue('--translation'))
        let duration = this.duration
        return [{
            targets: selected1,
            translateX: Number(selected1.style.getPropertyValue('--translation')) + currentPos2 - currentPos1,
            //backgroundColor: [
            //    {value: "#FFFFFF", duration: duration-1},
            //    {value: anime.get(selected1, "backgroundColor"), duration: 1}
            //],
            easing: 'easeOutCubic',
            duration: duration,
            complete: function() {selected1.style.setProperty('--translation', currentPos2 - selected1.style.getPropertyValue('--position'))}
        },
        {
            targets: selected2,
            translateX: Number(selected2.style.getPropertyValue('--translation')) + currentPos1 - currentPos2,
            //backgroundColor: [
            //    {value: "#000000", duration: duration-1},
            //    {value: anime.get(selected2, "backgroundColor"), duration: 1}
            //],
            easing: 'easeOutCubic',
            duration: duration,
            complete: function() {selected2.style.setProperty('--translation', currentPos1 - selected2.style.getPropertyValue('--position'))}
        }]
    }

    async Animate() {
        let animations = this.Animation
        for(let i=0; i<animations.length; i++) {
            console.log("animating")
            await anime(animations[i]).finished
        }
    }

    AddToTimeline(tl) {
        let animations = this.Animation
        console.log("timeline")
        tl.add(animations[0])
        .add(animations[1], `-=${this.duration}`)
    }

}

class Comparison extends Action {
    constructor (targets, line=1) {
        super(targets.filter(obj => typeof obj !== "undefined"), line)
        Comparison.duration = 1000
    }

    get duration() {
        return Comparison.duration / speed
    }

    get annotation() {
        if(this.targets.length == 1) {
            return `The element reached the first spot - it is the smallest in the list.`
        }
        return `Checking if ${this.targets[1].value} is less than ${this.targets[0].value}. If it is, then we will swap them.`
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
            targets: document.querySelector(`${element.id}`),
            backgroundColor: [{value: "#228C22", duration: this.duration-1},
                {value: anime.get(document.querySelector(`${element.id}`), "backgroundColor"), duration: 1}],
            duration: this.duration,
        }})
        return animations
    }

    async Animate() {

    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            index == 0 ? tl.add(animation) : tl.add(animation, `-=${this.duration}`)
        })
        //tl.add(animations[0])
        //.add(animations[1], `-=${this.duration}`)
    }

}

class Sorted extends Action {
    constructor(targets, line=3) {
        super(targets, line)
        Sorted.duration = 1
    }

    get duration() {
        return Sorted.duration / speed
    }

    get Animation() {
        return {
            targets: document.querySelector(`${this.targets.id}`),
            backgroundColor: "#FFA500",
            duration: this.duration,
        }
    }

    AddToTimeline(tl) {
        tl.add(this.Animation)
    }
}

class PivotToggle extends Action {
    constructor(targets, line=1) {
        super(targets, line)
        PivotToggle.duration = 500
    }

    get duration() {
        return PivotToggle.duration / speed
    }

    get Animation() {
        return {
            targets: document.querySelector(`${this.targets.id}`),
            duration: this.duration,
            backgroundColor: anime.get(document.querySelector(`${this.targets.id}`), "backgroundColor") === "rgb(98, 144, 200)" ? "#A020F0" : "#6290C8",
            begin: console.log(anime.get(document.querySelector(`${this.targets.id}`), "backgroundColor"))
        }
    }

    AddToTimeline(tl) {
        tl.add(this.Animation)
    }
}

class Subarray extends Action {
    constructor(targets, line=1) {
        super(targets, line)
        Subarray.duration = 0
    }

    get duration() {
        return Subarray.duration / speed
    }

    get Animation() {
        const animations = this.targets.map((element) => {
            return {
            targets: document.querySelector(`${element.id}`),
            backgroundColor: anime.get(document.querySelector(`${element.id}`), "backgroundColor") === "rgb(98, 144, 200)" ? "#f68f58" : "#6290C8",
            duration: this.duration,
        }})
        return animations
    }

    AddToTimeline(tl) {
        this.Animation.forEach((animation, index) => {
            index == 0 ? tl.add(animation) : tl.add(animation, `-=${this.duration}`)
        })
    }

}

// Draggable ----------------------------------------------------------------
document.querySelectorAll(".draggable").forEach((element) => {dragElement(element)})
document.querySelectorAll(".resizer").forEach((element) => {ResizeHandler(element)})

function ResizeHandler(element) {
    var x =0; var y = 0; var w = 0; var h = 0;
    const parent = element.parentNode

    element.addEventListener('mousedown', ResizeMouseDown)
    function ResizeMouseDown(event) {
        event.stopPropagation()
        event.preventDefault()
        x = event.clientX
        y = event.clientY

        w = parent.getBoundingClientRect().width
        h = parent.getBoundingClientRect().height

        document.addEventListener('mousemove', ResizeMouseMove)
        document.addEventListener('mouseup', ResizeMouseUp)
    }

    function ResizeMouseMove(event) {
        event.stopPropagation()
        event.preventDefault()
        const dx = event.clientX - x
        const dy = event.clientY - y

        x = event.clientX
        y = event.clientY

        w = parent.getBoundingClientRect().width
        h = parent.getBoundingClientRect().height

        parent.style.width = `${w + dx}px`
        parent.style.height = `${h + dy}px`
    }

    function ResizeMouseUp() {
        document.removeEventListener('mousemove', ResizeMouseMove)
        document.removeEventListener('mouseup', ResizeMouseUp)
    }
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      elmnt.onmousedown = dragMouseDown;
  
      while(elmnt.offsetWidth + elmnt.offsetLeft > window.innerWidth - 20) {
          elmnt.style.left = ((elmnt.offsetLeft - 10) / window.innerWidth * 100) + "%"
      }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      elmnt.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = ((elmnt.offsetTop - pos2) / window.innerHeight * 100) + "%"
      elmnt.style.left = ((elmnt.offsetLeft - pos1) / window.innerWidth * 100) + "%"
  }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      elmnt.onmouseup = null;
      elmnt.onmousemove = null;
    }
}
// ----------------------------------------------------------------

function DisplayAnnotation(msg, element) {
    element.innerHTML = msg
}

document.querySelector('#start').addEventListener('click', start)
document.querySelector('#getNewInput').addEventListener('click', function() {
    try {
    generateBars()
    }
    catch(error) {
        Alert(error.message, 'danger')
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
    speed = speeds[(speeds.indexOf(speed)+1)%speeds.length]
    this.innerHTML = `${speed}x`
})
document.querySelector("#reset").addEventListener("click", function() {
    generateBars()
    document.querySelector("#Progress-Bar").style.width = "0%"
    document.querySelector("#reset").style.display = "none"
    document.querySelector("#start").style.display = "inline"
    inProgress = false;
})


const alertContainer = document.getElementById('alertContainer')
function Alert(msg, type) {
    console.log("erroring")
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible position-absolute start-50 translate-middle-x" style="z-index: 999;" role="alert">`,
        `   <div>${msg}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')
      console.log(wrapper.innerHTML)
      alertContainer.append(wrapper)
}