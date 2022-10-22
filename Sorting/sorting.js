let input = []

window.onload = generateBars
window.onresize = generateBars

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
    let swaps = [] // saves the pair of index that are being swapped
    let steps = [] // saves the steps for the pseudocode highlighting
    let j, current, i
    for(i = 1; i < arr.length; i++) {
        //steps.push(1)

        current = arr[i]
        //steps.push(2)

        j = i - 1
        //steps.push(3)

        while(j >= 0 && arr[j].value > current.value) { // checks if j is outside of array and compares j position value with current
            //console.log(`left: ${arr[j].value} right: ${arr[j+1].value}`)
            //console.log(`${j} , ${j+1}`)
            //steps.push(4)
            swaps.push([current, arr[j]])
            arr[j + 1] = arr[j]
            //console.log(arr)
            //steps.push(5)

            j--
            //steps.push(6)
        }
        //swaps.push([arr[j+1], current])
        arr[j + 1] = current   // once while is false, the last j position is current
        //console.log(arr)
        //steps.push(7)
    }
    console.log(swaps)
    swap(swaps)
    printArr(input)
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
async function swap(swaps, steps) {
    for (let i = 0; i < swaps.length; i++) {
        let duration = 500
        const bars = swaps.map((element) => {
            return [document.querySelector(element[0].id), document.querySelector(element[1].id)]
        })
        let selected1 = bars[i][0]
        let selected2 = bars[i][1]
        let currentPos1 = Number(selected1.style.getPropertyValue('--position')) + Number(selected1.style.getPropertyValue('--translation'))
        let currentPos2 = Number(selected2.style.getPropertyValue('--position')) + Number(selected2.style.getPropertyValue('--translation'))
        swapAnim = anime.timeline({autoplay: false})
        swapAnim.add({
            targets: selected1,
            translateX: Number(selected1.style.getPropertyValue('--translation')) + currentPos2 - currentPos1,
            backgroundColor: [
                {value: "#FFFFFF", duration: duration-1},
                {value: "#6290C8", duration: 1}
            ],
            easing: 'easeOutCubic',
            duration: duration,
            complete: function(anim) {selected1.style.setProperty('--translation', currentPos2 - selected1.style.getPropertyValue('--position'))}
        }).add({
            targets: selected2,
            translateX: Number(selected2.style.getPropertyValue('--translation')) + currentPos1 - currentPos2,
            backgroundColor: [
                {value: "#000000", duration: duration-1},
                {value: "#6290C8", duration: 1}
            ],
            easing: 'easeOutCubic',
            duration: duration,
            complete: function(anim) {selected2.style.setProperty('--translation', currentPos1 - selected2.style.getPropertyValue('--position'))}
        }, `-=${duration}`)
        swapAnim.play()
        await swapAnim.finished

        //document.querySelector(selected1).classList.toggle('arrBarSelected')
        //selected1.classList.toggle('arrBarSelected')
        //document.querySelector(selected2).classList.toggle('arrBarSelected')
        //selected2.classList.toggle('arrBarSelected')
        //await new Promise(resolve => setTimeout(resolve, 1000))

        //document.querySelector(selected1).classList.toggle('arrBarSelected')
        //selected1.classList.toggle('arrBarSelected')
        //document.querySelector(selected2).classList.toggle('arrBarSelected')
        //selected2.classList.toggle('arrBarSelected')
        //await new Promise(resolve => setTimeout(resolve, 1000))
    }
}

// prints array to console
function printArr(arr) { 
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i])
    }
}

function start() {
    insertionSort(input);
}

document.querySelector('#start').addEventListener('click', start)
document.querySelector('#getNewInput').addEventListener('click', generateBars)