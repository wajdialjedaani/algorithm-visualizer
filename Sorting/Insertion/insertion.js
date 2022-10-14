let input = [32, 24, 10, 22, 18, 40, 4, 43, 2, 25];

window.onload = generate(input);

function generate(arr) {
    for(let i = 0; i < arr.length; i++) {
        let arrBar = document.createElement('div');
        let arrBarID = 'arrBar' + i;
        arrBar.classList.add('arrBar');
        arrBar.setAttribute('id', arrBarID);
        arrBar.style.height = (arr[i] * 10) + 'px';
        let container = document.querySelector('#arrCanvas').appendChild(arrBar);
    }
}

function insertionSort(arr) {
    let n = arr.length;
    
    for(let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;

        let selected1 = '#arrBar' + i;
        let selected2 = '#arrBar' + j;
        // let selected = document.getElementById(selected1);
        // console.log(selected);
        document.querySelector(selected1).classList.toggle('arrBarSelected');
        document.querySelector(selected1).classList.toggle('arrBarSelected');

        anime({
            targets: [selected1, selected2],
            translateX: 100,
            duration: 1000,
        });

        while(j >= 0 && arr[j] > current) { // checks if j is outside of array and compares j position value with current
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;   // once while is false, the last j position is current
        //document.getElementById(selected1).classList.toggle('arrBarSelected');
    }
    console.log("done");
}

function printArr(arr) {
    for(let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

function start() {
    insertionSort(input);
}

document.querySelector('#start').addEventListener('click', start);