let input = [32, 24, 10, 22, 18, 40, 4, 43, 2, 25];

window.onload = addDefaultElements;

function addDefaultElements(arr) {
    for(let i = 0; i < arr.length; i++) {
        
    }
}

function insertionSort(arr) {
    let n = arr.length;
    
    for(let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;

        while(j >= 0 && arr[j] > current) { // checks if j is outside of array and compares j position value with current
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;   // once while is false, the last j position is current
    }
}

function printArr(arr) {
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

function start() {
    insertionSort(input);
    printArr(input);
}

document.querySelector('#start').addEventListener('click', start);