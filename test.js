function getUnique(array) {
  var uniqueArray = [];

  // Loop through array values
  for (i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
}

const arr = [1, 3, 3, 3, 2, 4];

console.log(getUnique(arr));
