let selectedFunction = (new URLSearchParams(window.location.search)).get("func")
let input = []
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

// Binary Search iterative approach
function binarySearchInterative(arr, x) {
    let left = 0
    let right = arr.length - 1
    let mid
    let current = []
    let ruleOutRange = []
    while (left <= right) {
        mid = Math.floor(left + (right - left) / 2)
        current.push(mid)
        if(x == arr[mid].value) {
            ruleOutRange.push([-1, -1])
            binaryAnimation(current, ruleOutRange, mid)
            return mid
        } else if(x > arr[mid].value) {   // x is on the right side
            ruleOutRange.push([left, mid])
            left = mid + 1
        } else { // x is on the left side
            ruleOutRange.push([mid, right])
            right = mid - 1
        }
    }
    mid = -1
    binaryAnimation(current, ruleOutRange, mid)
    return -1
}

// linear search algorithm
function linearSearch(arr, x) {
    console.log("linear", x)
    let current = []
    for (let i = 0; i < arr.length; i++) {
        current.push("#arrBox" + i)
        if(arr[i].value == x) {
            printArr(current)
            let foundInd = i
            linearAnimation(current, foundInd)
            console.log("Found at " + i);
            return i
        }
    }
    printArr(current)
    linearAnimation(current, x)
    return -1
}

function DisplayAnnotation(msg, element) {
    element.innerHTML = msg
}

function changeAlgo(func) {
    let pseudocode
    if(func == "binarysearch") {
        pseudocode = `binarySearch(arr, x, low, high) <br>
        &emsp;repeat till low = high <br>
        &emsp;&emsp;mid = (low + high)/2 <br>
        &emsp;&emsp;if (x == arr[mid]) <br>
        &emsp;&emsp;&emsp;return mid <br>
        &emsp;&emsp;else if (x > arr[mid]) <br>
        &emsp;&emsp;&emsp;low = mid + 1 <br>
        &emsp;&emsp;else<br>
        &emsp;&emsp;&emsp;high = mid - 1 <br>`
        selectedFunction = binarySearchInterative
        document.querySelector("#Header").textContent = "Binary Search"
    }
    else if(func == "linearsearch") {
        pseudocode = `linearSearch(arr, x) <br>
        &emsp;loop till end of array <br>
        &emsp;&emsp;if (x == current value)<br>
        &emsp;&emsp;&emsp;return i<br>`
        selectedFunction = linearSearch
        document.querySelector("#Header").textContent = "Linear Search"
    }
    DisplayAnnotation(pseudocode, document.querySelector("#pseudocode>.card-body>p"))
}

changeAlgo(selectedFunction)

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
    input.sort((a,b) => a.value - b.value)
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

async function binaryAnimation(current, ruleOutRange, mid) {
    progress = document.querySelector("#Progress-Bar");
    for (let i = 0; i < current.length; i++) {
        var searchAnim = anime.timeline({autoplay: false})

        searchAnim.add({
            targets: "#arrBox" + current[i],
            backgroundColor: {value: "#84A98C", delay: 60 / speed, duration: 300},
            easing: 'easeOutCubic',
        })

        if(input[current[i]].value > x) {
            DisplayAnnotation(`${input[current[i]].value} > ${x}<br>Eliminating left side of ${input[current[i]].value}.`, document.querySelector("#annotation>.card-body>p"))
        } else if (input[current[i]].value < x) {
            DisplayAnnotation(`${input[current[i]].value} < ${x}<br>Eliminating right side of ${input[current[i]].value}.`, document.querySelector("#annotation>.card-body>p"))
        } else if (input[current[i]].value == x){
            DisplayAnnotation(`${input[current[i]].value} == ${x}<br>Target value has been found.`, document.querySelector("#annotation>.card-body>p"))
        }

        searchAnim.add({
            targets: ruleOut(ruleOutRange[i]),
            backgroundColor: {value: "#696464", delay: 60 / speed, duration: 300},
            easing: 'easeOutCubic', 
        })

        searchAnim.play()
        progress.style.width = `${(i/current.length) * 100}%`;
        await searchAnim.finished
    }

    if (mid == -1) {
        DisplayAnnotation(`${x} is not in the list.`, document.querySelector("#annotation>.card-body>p"))
    }
    searchAnim = anime({
        targets: "#arrBox" + mid,
        backgroundColor: "#F26419",
        delay: 60 / speed,
        duration: 500
    })
    progress.style.width = `100%`;
    await searchAnim.finished
}

async function linearAnimation(current, foundInd) {
    progress = document.querySelector("#Progress-Bar");
    console.log(current[0], foundInd);
    for (let i = 0; i < current.length; i++) {
        var searchAnim = anime.timeline({autoplay: false})

        searchAnim.add({
            targets: current[i],
            backgroundColor: "#84A98C",
            delay: 60 / speed,
            duration: 300,
            easing: 'easeOutCubic',
        })

        if(current[i] == "#arrBox" + foundInd) {
            DisplayAnnotation(`${input[foundInd].value} == ${input[i].value}.<br>Found ${input[foundInd].value} at index ${foundInd}`, document.querySelector("#annotation>.card-body>p"))
            searchAnim.add({
                targets: current[i],
                backgroundColor: "#F26419",
                delay: 60 / speed,
                duration: 300,
                easing: 'easeOutCubic', 
            })
        } else {
            DisplayAnnotation(`${input[foundInd].value} > ${input[i].value}<br>Eliminate and check next value.`, document.querySelector("#annotation>.card-body>p"))
            searchAnim.add({
            targets: current[i],
            backgroundColor: "#696464",
            delay: 60 / speed,
            duration: 300,
            easing: 'easeOutCubic', 
            })
        }

        searchAnim.play()
        progress.style.width = `${(i/current.length) * 100}%`;
        await searchAnim.finished   
    }
    progress.style.width = `100%`;
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
    if(inProgress) {
        console.log("Animation in progress, can't play")
        return
    }
    inProgress = true
    generateBox()
    getFindValue()
    selectedFunction(input, x)
    // .then(function(value) {
    //     document.querySelector("#start").style.display = "none"
    //     document.querySelector("#reset").style.display = "inline"
    // })
    //.catch((error) => {console.log("Error in start()")})
    .finally( function() {
        inProgress = false
    })
}


document.querySelectorAll(".draggable").forEach((element) => {dragElement(element)})

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
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
    elmnt.style.top = ((elmnt.offsetTop - pos2) / window.innerHeight * 100) + "%";
    elmnt.style.right = ((window.innerWidth - parseFloat(window.getComputedStyle(elmnt, null).getPropertyValue("width")) - elmnt.offsetLeft + pos1) / window.innerWidth * 100) + "%";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.querySelector('#start').addEventListener('click', start)
document.querySelector('#start1').addEventListener('click', start)
document.querySelector('#FindValue').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        e.preventDefault()
        document.querySelector('#start').click()
    }
})
document.querySelector("#AnimSpeed").addEventListener("click", function() {
    speed = speeds[(speeds.indexOf(speed)+1)%speeds.length]
    this.innerHTML = `${speed}x`
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
