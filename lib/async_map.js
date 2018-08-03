exports.asyncMap = async (array, callback, thisArg) => {
  const promiseArray = [];
  for (let i = 0; i < array.length; i++) {
    if (i in array) {
      promiseArray[i] = Promise.resolve(array[i]).then((currentValue) => {
        return callback.call(thisArg || this, currentValue, i, array);
      });
    }
  }
  return Promise.all(promiseArray);
};