import { Swap, Comparison, Sorted, PivotToggle, Subarray } from "../../SortingAnimations.js"

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export function BubbleSort(arr) {
    const actions = []
    for(let i = 0; i < arr.length - 1; i++) {
        for(let j = 0; j < arr.length - i - 1; j++) {
            actions.push(new Comparison([arr[j], arr[j + 1]]))
            if(arr[j].value > arr[j + 1].value) {
                // swap
                actions.push(new Swap([arr[j], arr[j + 1]]))
                swap(arr, j, j + 1)
            }
        }
    }
    return actions
}