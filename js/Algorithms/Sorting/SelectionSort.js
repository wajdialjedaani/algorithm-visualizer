import { Swap, Comparison, Sorted, PivotToggle, Subarray } from "../../SortingAnimations.js"

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export function SelectionSort(arr) {
    let min_ind
    const actions = []

    for(let i = 0; i < (arr.length - 1); i++) {
        min_ind = i
        
        for(let j = i + 1; j < arr.length; j++) {
            actions.push(new Comparison([arr[j], arr[min_ind]]))
            if(arr[j].value < arr[min_ind].value) {
                min_ind = j
            }
        }
        // swap
        actions.push(new Swap([arr[min_ind], arr[i]]))
        swap(arr, min_ind, i)
    }
    return actions
}