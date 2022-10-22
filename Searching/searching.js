/* Binary Search iterative approach */
function binarySearch(arr, To_Find) {
    let left = 0;
    let right = v.length - 1;
    let mid;
     
    while (right - left > 1) {
        let mid = (right + left) / 2;
        if (arr[mid] < To_Find) {
            left = mid + 1;
        }
        else {
            right = mid;
        }
    }
    if (arr[left] == To_Find) {
        console.log( "Found At Index " + left);
    }
    else if (arr[right] == To_Find) {
        console.log("Found At Index " + right);
    }
    else {
        console.log("Not Found");
    }
}