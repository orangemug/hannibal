module.exports = {
  minLength: function minStringLength (value, length) {
    if (value.length < length) {
      throw new Error("string is too short, requires: " + length + " chars and was: " + value.length);
    }
  },
  maxLength: function maxStringLength (value, length) {
    if (value.length > length) {
      throw new Error("string is too long, requires: " + length + " chars and was: " + value.length);
    }
  },
  pattern: function regexString (value, regex) {
    var regexp = new RegExp(regex);
    if (!regexp.exec(value)) {
      throw new Error("string does not match regex");
    }
  },
  enum: function enumString (value, values) {
    if (values.indexOf(value) < 0) {
      throw new Error("string: " + value + " is not one of: " + values.join(", "));
    }
  }
};
