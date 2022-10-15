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
    let swaps = [];
    let steps = [];

    
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
    
    swap(swaps, steps);
    printArr(steps);

    
}

async function swap(swaps, steps) {
    var t1 = anime.timeline;
    // for (let i = 0; i < swaps.length; i++) {
    //     let selected1 = '#arrBar' + swaps[i][0];
    //     let selected2 = '#arrBar' + swaps[i][1];

    //     document.querySelector(selected1).classList.toggle('arrBarSelected');
    //     document.querySelector(selected2).classList.toggle('arrBarSelected');
    //     await new Promise(resolve => setTimeout(resolve, 1000));

    //     document.querySelector(selected1).classList.toggle('arrBarSelected');
    //     document.querySelector(selected2).classList.toggle('arrBarSelected');
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    // }
    
    for (let i = 0; i < steps.length; i++) {
        let step = '#step' + steps[i];

        document.querySelector(step).classList.toggle('activeStep');
        await new Promise(resolve => setTimeout(resolve, 1000));

        document.querySelector(step).classList.toggle('activeStep');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // setInterval(() => {
    //     let selected1 = '#arrBar' + steps[i][0];
    //     let selected2 = '#arrBar' + steps[i][1];
    //     console.log(selected1, selected2);
    //     i++
    // }, 2000);

    // steps.forEach((el, i) => {
        

    //     setInterval(function() {
    //         let selected1 = '#arrBar' + steps[i][0];
    //         let selected2 = '#arrBar' + steps[i][1];
    //         console.log('selected');
    //     }, 1000);

    //     setTimeout(() => {
            
    //         // document.querySelector(selected1).classList.toggle('arrBarSelected');
    //         // document.querySelector(selected2).classList.toggle('arrBarSelected');
    //         console.log("selected")

    //         setTimeout(() => {
    //             // document.querySelector(selected1).classList.toggle('arrBarSelected');
    //             // document.querySelector(selected2).classList.toggle('arrBarSelected');
    //             console.log("removed")
    //         }, 2000 * i); 

    //     }, 2000 * i);

        
        
    // });
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