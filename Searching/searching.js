let input = []

window.onload = generateBox
window.onresize = generateBox

// Binary Search iterative approach
function binarySearchInterative(arr, x) {
    let left = 0
    let right = arr.length - 1
    let mid
     
    while (right - left > 1) {
        let mid = (right + left) / 2
        if (arr[mid] < x) {
            left = mid + 1
        }
        else {
            right = mid
        }
    }
    if (arr[left] == x) {
        console.log( "Found At Index " + left)
    }
    else if (arr[right] == x) {
        console.log("Found At Index " + right)
    }
    else {
        console.log("Not Found")
    }
}

// Binary Search recursive approach
function binarySearchRecursive(arr, left, right, x) {
    if(right >= 1) {    
        let mid = left + Math.floor((right - 1) / 2)

        // if element is at the middle; itself
        if(arr[mid] == x) {
            console.log("x was found");
            return mid
        }

        // if element is smaller than the mid value
        // can only be in left subarray
        if(arr[mid] > x) {
            return binarySearchRecursive(arr, left, mid - 1, x)
        }

        // if element is larger than the mid value
        // can only be in right subarray
        return binarySearchRecursive(arr, mid + 1, r, x)
    }

    console.log("Element does not exist in the array")
    return -1
}

// ----------------------------------------------------------------

// gets input and splits it into an array
function getInput() {    
    var inputString = document.getElementById('input').value
    input = inputString.split(", ")
    input.forEach((val, i, arr) => {arr[i] = {
        value: Number(val),
        id: `#arrBox${i}`   // id="arrBoxi"
    }})
    printArr(input)
    return input
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