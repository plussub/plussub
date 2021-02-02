export const binarySearch = (target, arr) => {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    const mid = parseInt((start + (end - start) / 2).toString(), 10);
    if (target >= arr[mid].from && target <= arr[mid].to) {
      return mid;
    } else if (target > arr[mid].to) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return -1;
};
