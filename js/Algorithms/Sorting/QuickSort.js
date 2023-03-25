import { Swap, Comparison, Sorted, PivotToggle, Subarray } from "../../SortingAnimations.js"

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export function QuickSort(arr, low, high, actions) {
    if(typeof actions === "undefined") {
        actions = []
    }
    if(low < high) {
        let pivot = Partition(arr, low, high, actions)

        QuickSort(arr, low, pivot - 1, actions)
        QuickSort(arr, pivot + 1, high, actions)
    }
    return actions
}

function Partition(arr, low, high, actions) {
    let pivot = arr[high].value
    actions.push(new PivotToggle(arr[high]))
    actions.push(new Subarray(arr.slice(low, high)))
    let i = (low - 1)

    for (let j = low; j <= high - 1; j++) {
        actions.push(new Comparison([arr[j], arr[high]]))
        if(arr[j].value < pivot) {
            i++
            actions.push(new Swap([arr[i], arr[j]], 21))
            swap(arr, i, j)
        }   
    }
    actions.push(new Swap([arr[i + 1], arr[high]], 22))
    actions.push(new PivotToggle(arr[high]))
    actions.push(new Subarray(arr.slice(low, high)))
    swap(arr, i + 1, high)
    return (i + 1)
}