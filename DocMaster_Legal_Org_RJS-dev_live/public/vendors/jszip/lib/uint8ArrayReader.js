"use strict";
var ArrayReader = require("./arrayReader");

function Uint8ArrayReader(data) {
  if (data) {
    this.data = data;
    this.length = this.data.length;
    this.index = 0;
    this.zero = 0;
  }
}
Uint8ArrayReader.prototype = new ArrayReader();
/**
 * @see DataReader.readData
 */
Uint8ArrayReader.prototype.readData = function (size) {
  this.checkOffset(size);
  if (size === 0) {
    // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
    return new Uint8Array(0);
  }
  var result = this.data.subarray(
    this.zero + this.index,
    this.zero + this.index + size,
  );
  this.index += size;
  return result;
};
module.exports = Uint8ArrayReader;
