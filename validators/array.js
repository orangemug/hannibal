module.exports = {
  minItems: function minArrayLength (value, length) {
    if (value.length < length) {
      throw new Error("array is too short, requires: " + length + " items and was: " + value.length);
    }
  },
  maxItems: function maxArrayLength (value, length) {
    if (value.length > length) {
      throw new Error("array is too long, requires: " + length + " items and was: " + value.length);
    }
  }
};
