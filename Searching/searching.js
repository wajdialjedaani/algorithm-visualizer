let input = []
let x

window.onload = generateBox
window.onresize = generateBox

// Binary Search iterative approach
function binarySearchInterative(arr, x) {
    let left = 0
    let right = arr.length - 1
    let mid
    while (left <= right) {
        mid = Math.floor(left + (right - left) / 2)
        if(x == arr[mid].value) {
            console.log("Found at " + mid);
            return mid
        } else if(x > arr[mid].value) {   // x is on the right side
            left = mid + 1
        } else { // x is on the left side
            right = mid - 1
        }
    }
    console.log("Could not find " + x);
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
    //printArr(input)
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