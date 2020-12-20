export const findNext = (target, arr) => {
  let start = 0;
  let end = arr.length - 1;
  let closestPos = -1;
  let closestVal = -1;
  while (start <= end) {
    const mid = parseInt((start + (end - start) / 2).toString(), 10);
    if(closestVal === -1 && target < arr[mid].from){
      closestVal = arr[mid].from
      closestPos = mid;
    }
    if(closestVal !== -1 && target < arr[mid].from && closestVal-target > arr[mid].from - target){
      closestVal = arr[mid].from
      closestPos = mid;
    }
    if (target >= arr[mid].from && target <= arr[mid].to) {
      return mid;
    } else if (target > arr[mid].to) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return closestPos;
};
