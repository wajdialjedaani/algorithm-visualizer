let input = [];

window.onload = generateBars();

// gets input and splits it into an array
function getInput() {    
    var inputString = document.getElementById('input').value;
    input = inputString.split(", ");
    return input;
}

// generates the bars, can be used with user inputs
function generateBars() {    
    removeBars();
    input = getInput();
    for(let i = 0; i < input.length; i++) {
        let arrBar = document.createElement('div');
        let arrBarID = 'arrBar' + i;
        arrBar.classList.add('arrBar');
        arrBar.setAttribute('id', arrBarID);
        arrBar.style.height = (input[i] * 10) + 'px';
        let container = document.querySelector('#arrCanvas').appendChild(arrBar);
    }
}

// removes existing bars
function removeBars() { 
    var bars = document.querySelectorAll('.arrBar');
    bars.forEach(element => element.remove());
}

// starts the sorting algorithm
function start() {  
    insertionSort(input);
    printArr(input);
}

// insertion sort algorithm
function insertionSort(arr) {
    let n = arr.length;
    let swaps = []; // saves the pair of index that are being swapped
    let steps = []; // saves the steps for the pseudocode highlighting

    for(let i = 1; i < n; i++) {
        steps.push(1);

        let current = arr[i];
        steps.push(2);

        let j = i - 1;
        steps.push(3);

        while(j >= 0 && arr[j] > current) { // checks if j is outside of array and compares j position value with current
            steps.push(4);
            swaps.push([i, j]);

            arr[j + 1] = arr[j];
            steps.push(5);

            j--;
            steps.push(6);
        }
        arr[j + 1] = current;   // once while is false, the last j position is current
        steps.push(7);
    }
    
    swap(swaps); 
    step(steps);
}

// highlights the pseudocode step
async function step(steps) {    
    for (let i = 0; i < steps.length; i++) {
        let step = '#step' + steps[i];

        document.querySelector(step).classList.toggle('activeStep');
        await new Promise(resolve => setTimeout(resolve, 1000));

        document.querySelector(step).classList.toggle('activeStep');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// highlights and swaps bars
async function swap(swaps, steps) { 
    for (let i = 0; i < swaps.length; i++) {
        let selected1 = '#arrBar' + swaps[i][0];
        let selected2 = '#arrBar' + swaps[i][1];

        document.querySelector(selected1).classList.toggle('arrBarSelected');
        document.querySelector(selected2).classList.toggle('arrBarSelected');
        await new Promise(resolve => setTimeout(resolve, 1000));

        document.querySelector(selected1).classList.toggle('arrBarSelected');
        document.querySelector(selected2).classList.toggle('arrBarSelected');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// prints array to console
function printArr(arr) { 
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

document.querySelector('#start').addEventListener('click', start);
document.querySelector('#getNewInput').addEventListener('click', generateBars);