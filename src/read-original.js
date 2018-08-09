"use strict";

var copychars = require("@dcos/copychars").default;

var RECORD_PATTERN = /^\d+\n.+/;

module.exports = function read(input) {
  var records = [];
  var rest = input;
  var delimiterPosition,
    recordLength,
    recordStartPosition,
    recordEndPosition,
    record;

  while (RECORD_PATTERN.test(rest)) {
    delimiterPosition = rest.indexOf("\n");

    recordLength = parseInt(rest.substring(0, delimiterPosition), 10);

    recordStartPosition = delimiterPosition + 1;
    recordEndPosition = recordStartPosition + recordLength;

    if (isNaN(recordLength) || rest.length < recordEndPosition) {
      return [records, rest];
    }

    record = copychars(rest, recordStartPosition, recordLength);
    rest = rest.substring(recordEndPosition);

    records.push(record);
  }

  return [records, rest];
};
