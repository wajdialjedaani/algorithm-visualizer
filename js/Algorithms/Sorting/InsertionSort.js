import { Swap, Comparison, Sorted, PivotToggle, Subarray } from "../../SortingAnimations.js"

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export function InsertionSort(arr) {
    let j, current, i
    const actions = []
    for(i = 1; i < arr.length; i++) {
        current = arr[i]
        j = i - 1
        actions.push(new Sorted(arr[j]))
        actions.push(new Comparison([arr[j], current]))
        while(j >= 0 && arr[j].value > current.value) { // checks if j is outside of array and compares j position value with current
            actions.push(new Swap([current, arr[j]]))
            //actions.push(new Sorted(arr[j]))

            arr[j + 1] = arr[j]
            j--

            actions.push(new Comparison([arr[j], current]))
        }
        arr[j + 1] = current   // once while is false, the last j position is current
        actions.push(new Sorted(current))
    }
    return actions
}