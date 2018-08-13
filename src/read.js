"use strict";

var copychars = require("@dcos/copychars").default;

var RECORD_PATTERN = /^\d+\n.+/;

function charSizeAt(string, index) {
  var charCode = string.charCodeAt(index);

  if (isNaN(charCode)) {
    return 0;
  }

  if (0xdc00 <= charCode && charCode <= 0xdfff) {
    return 1;
  }

  if (charCode >= 0x0080 && charCode <= 0x07ff) {
    return 2;
  }

  if (charCode >= 0x0800 && charCode <= 0xffff) {
    return 3;
  }
  return 1;
}

module.exports = function read(input) {
  var records = [];
  var data = input;
  var dataLength,
    delimiterPosition,
    record,
    recordSize,
    recordStartPosition,
    recordEndPosition,
    size;

  while (RECORD_PATTERN.test(data)) {
    dataLength = data.length;
    delimiterPosition = data.indexOf("\n");

    recordSize = parseInt(data.substring(0, delimiterPosition), 10);

    recordStartPosition = delimiterPosition + 1;
    recordEndPosition = recordStartPosition;

    if (isNaN(recordSize) || recordStartPosition >= dataLength) {
      return [records, data];
    }

    size = 0;
    while (size < recordSize && recordEndPosition < dataLength) {
      size += charSizeAt(data, recordEndPosition++);
    }

    if (size != recordSize) {
      return [records, data];
    }

    record = copychars(
      data,
      recordStartPosition,
      recordEndPosition - recordStartPosition
    );
    data = data.substring(recordEndPosition);
    records.push(record);
  }

  return [records, data];
};
