let input = []
let x

window.onload = generateBox
window.onresize = generateBox

// Binary Search iterative approach
function binarySearchInterative(arr, x) {
    let left = 0
    let right = arr.length - 1
    let mid
    let current = []
    let ruleOutRange = []
    while (left <= right) {
        mid = Math.floor(left + (right - left) / 2)
        current.push("#arrBox" + mid)
        if(x == arr[mid].value) {
            ruleOutRange.push([-1, -1])
            console.log("Found at " + mid);
            // printArr(current)
            printArr(ruleOutRange)
            animation(current, ruleOutRange, mid)
            return mid
        } else if(x > arr[mid].value) {   // x is on the right side
            ruleOutRange.push([left, mid])
            left = mid + 1
        } else { // x is on the left side
            ruleOutRange.push([mid, right])
            right = mid - 1
        }
    }
    console.log("Could not find " + x);
    // printArr(current)
    printArr(ruleOutRange)
    animation(current, ruleOutRange)
    return -1
}

// // Binary Search recursive approach
// function binarySearchRecursive(arr, left, right, x) {
//     if(right >= 1) {    
//         let mid = left + Math.floor((right - 1) / 2)

//         // if element is at the middle; itself
//         if(arr[mid] == x) {
//             console.log("x was found");
//             return mid
//         }

//         // if element is smaller than the mid value
//         // can only be in left subarray
//         if(arr[mid] > x) {
//             return binarySearchRecursive(arr, left, mid - 1, x)
//         }

//         // if element is larger than the mid value
//         // can only be in right subarray
//         return binarySearchRecursive(arr, mid + 1, r, x)
//     }

//     console.log("Element does not exist in the array")
//     return -1
// }

// ----------------------------------------------------------------

// gets input and splits it into an array
function getInput() {    
    var inputString = document.getElementById('input').value
    input = inputString.split(", ")
    input.forEach((val, i, arr) => {arr[i] = {
        value: Number(val),
        id: `#arrBox${i}`   // id="arrBoxi"
    }})
    return input
}

function getFindValue() {
    x = document.getElementById('FindValue').value
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
        let arrBoxID = 'arrBox' + i
        arrBox.innerHTML = input[i].value
        arrBox.classList.add('arrBox')
        arrBox.setAttribute('id', arrBoxID)
        arrBox.style.setProperty('--position', `${i * document.querySelector('#arrCanvas').clientWidth / input.length}`)
        arrBox.style.setProperty('--translation', 0)
        container.appendChild(arrBox)
    }
}

async function animation(current, ruleOutRange, mid) {
    for (let i = 0; i < current.length; i++) {
        var searchAnim = anime.timeline({autoplay: false})

        searchAnim
        .add({
            targets: current[i],
            backgroundColor: {value: "#84A98C", duration: 500},
            easing: 'easeOutCubic',
        })
        .add({
            targets: ruleOut(ruleOutRange[i]),
            backgroundColor: {value: "#696464"},
            easing: 'easeOutCubic', 
        })

        searchAnim.play()
        await searchAnim.finished

        
    }
    anime({
        targets: "#arrBox" + mid,
        backgroundColor: "#F26419",
    })
}

function ruleOut(givenRange) {
    let rangeID = []
    console.log(givenRange);
    for (let i = givenRange[0]; i <= givenRange[1]; i++) {
        rangeID.push("#arrBox" + i)
    }

    return rangeID
}

// prints array to console
function printArr(arr) { 
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i])
    }
}

function start() {
    getFindValue()
    console.log(x)
    binarySearchInterative(input, x)
}

document.querySelector('#start').addEventListener('click', start)
document.querySelector('#FindValue').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        e.preventDefault()
        document.querySelector('#start').click()
    }
})