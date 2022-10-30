let input = []
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

function changeAlgo(func) {
    let text
    if(func == "insertion") {
        text = ``
        selectedFunction = insertionSort
        document.querySelector("#Header").textContent = "Insertion Sort"
    }
}

// gets input and splits it into an array
function getInput() {    
    var inputString = document.getElementById('input').value
    input = inputString.split(", ")
    input.forEach((val, i, arr) => {arr[i] = {
        value: Number(val),
        id: `#arrBar${i}`
    }})
    return input
}

// generates the bars, can be used with user inputs
function generateBars() {
    removeBars()
    input = getInput()
    let container = document.querySelector('#arrCanvas')
    container.style.setProperty("--columns", input.length)
    container.style.setProperty("--width", document.querySelector('#arrCanvas').clientWidth / input.length)
    let max = Math.max(...input.map(o => o.value))
    let maxHeight = container.getBoundingClientRect().height
    console.log(maxHeight)
    for(let i = 0; i < input.length; i++) {
        let arrBar = document.createElement('div')
        let arrBarID = 'arrBar' + i
        arrBar.classList.add('arrBar')
        arrBar.setAttribute('id', arrBarID)
        arrBar.style.setProperty('--position', `${i * document.querySelector('#arrCanvas').clientWidth / input.length}`)
        arrBar.style.setProperty('--translation', 0)
        arrBar.style.height = (maxHeight * (input[i].value / max)) + 'px'
        container.appendChild(arrBar)
    }
}

// removes existing bars
function removeBars() { 
    var bars = document.querySelectorAll('.arrBar')
    bars.forEach(element => element.remove())
}

// insertion sort algorithm
function insertionSort(arr) {
    let actions = [] // saves the pair of index that are being swapped
    let steps = [] // saves the steps for the pseudocode highlighting
    let j, current, i
    for(i = 1; i < arr.length; i++) {
        current = arr[i]
        j = i - 1

        actions.push(new Comparison([arr[j], current]))
        while(j >= 0 && arr[j].value > current.value) { // checks if j is outside of array and compares j position value with current
            actions.push(new Swap([current, arr[j]]))

            arr[j + 1] = arr[j]
            j--

            actions.push(new Comparison([arr[j], current]))
        }
        arr[j + 1] = current   // once while is false, the last j position is current
    }
    return actions
}

// highlights the pseudocode step
async function step(steps) {    
    for (let i = 0; i < steps.length; i++) {
        let step = '#step' + steps[i]

        document.querySelector(step).classList.toggle('activeStep')
        await new Promise(resolve => setTimeout(resolve, 1000))

        document.querySelector(step).classList.toggle('activeStep')
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
}

// highlights and swaps bars
async function swap(actions, steps) {
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
        action.AddToTimeline(tl)
        await tl.finished
    }
    playing = false
    //playing = true
    //for (let i = 0; i < swaps.length; i++) {
    //    let duration = 500/speed
    //    const bars = swaps.map((element) => {
    //        return [document.querySelector(element[0].id), document.querySelector(element[1].id)]
    //    })
    //    let selected1 = bars[i][0]
    //    let selected2 = bars[i][1]
    //    let currentPos1 = Number(selected1.style.getPropertyValue('--position')) + Number(selected1.style.getPropertyValue('--translation'))
    //    let currentPos2 = Number(selected2.style.getPropertyValue('--position')) + Number(selected2.style.getPropertyValue('--translation'))
    //    swapAnim = anime.timeline({autoplay: false})
    //    swapAnim.add({
    //        targets: selected1,
    //        translateX: Number(selected1.style.getPropertyValue('--translation')) + currentPos2 - currentPos1,
    //        backgroundColor: [
    //            {value: "#FFFFFF", duration: duration-1},
    //            {value: "#6290C8", duration: 1}
    //        ],
    //        easing: 'easeOutCubic',
    //        duration: duration,
    //        complete: function(anim) {selected1.style.setProperty('--translation', currentPos2 - selected1.style.getPropertyValue('--position'))}
    //    }).add({
    //        targets: selected2,
    //        translateX: Number(selected2.style.getPropertyValue('--translation')) + currentPos1 - currentPos2,
    //        backgroundColor: [
    //            {value: "#000000", duration: duration-1},
    //            {value: "#6290C8", duration: 1}
    //        ],
    //        easing: 'easeOutCubic',
    //        duration: duration,
    //        complete: function(anim) {selected2.style.setProperty('--translation', currentPos1 - selected2.style.getPropertyValue('--position'))}
    //    }, `-=${duration}`)
    //    swapAnim.play()
    //    await swapAnim.finished
    //    document.querySelector("#Progress-Bar").style.width = ((i+1) / swaps.length * 100) + "%"
    //}
    //playing = false
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
    inProgress = true
    let swaps = selectedFunction(input);
    swap(swaps)
    .then( function(value) {
        document.querySelector("#start").style.display = "none"
        document.querySelector("#reset").style.display = "inline"
    })
    .catch((error) => {console.log("Error in start()")})
    .finally( function() {
        inProgress = false
    })
}

document.querySelector('#start').addEventListener('click', start)
document.querySelector('#getNewInput').addEventListener('click', generateBars)
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

class Action {
    constructor(targets) {
        this.targets = targets
    }

    get duration() {
        return 1000
    }
}

class Swap extends Action {
    constructor(targets) {
        super(targets)
        Swap.duration = 500
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
            backgroundColor: [
                {value: "#FFFFFF", duration: duration-1},
                {value: "#6290C8", duration: 1}
            ],
            easing: 'easeOutCubic',
            duration: duration,
            complete: function() {selected1.style.setProperty('--translation', currentPos2 - selected1.style.getPropertyValue('--position'))}
        },
        {
            targets: selected2,
            translateX: Number(selected2.style.getPropertyValue('--translation')) + currentPos1 - currentPos2,
            backgroundColor: [
                {value: "#000000", duration: duration-1},
                {value: "#6290C8", duration: 1}
            ],
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
    constructor (targets) {
        super(targets.filter(obj => typeof obj !== "undefined"))
        Comparison.duration = 500
    }

    get duration() {
        return Comparison.duration / speed
    }

    get Animation() {
        return {
            targets: this.targets.map((element) => {return document.querySelector(`${element.id}`)}),
            backgroundColor: [{value: "#228C22", duration: this.duration-1},
                {value: "#6290C8", duration: 1}],
            duration: this.duration,
        }
    }

    async Animate() {

    }

    AddToTimeline(tl) {
        tl.add(this.Animation)
    }
}