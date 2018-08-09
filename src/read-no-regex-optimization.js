"use strict";

var copychars = require("@dcos/copychars").default;

var RECORD_PATTERN = /^\d+\n.+/;

function countExtraCodepoints(string, start, end) {
    let length = end;
    let extraCodePoints = 0;
    let i = 0;

    while (i < end - 1) {
        let codePoint = string.charCodeAt(start + i);

        if (codePoint > 0x7f && codePoint <= 0x7ff) extraCodePoints++;

        i++;
    }

    return extraCodePoints;
}

module.exports = function read(input) {
  var records = [];
  var rest = input;
  var delimiterPosition,
    recordLength,
    recordStartPosition,
    recordEndPosition,
    byteCorrection,
    record;

  while (RECORD_PATTERN.test(rest)) {
    delimiterPosition = rest.indexOf("\n");

    recordLength = parseInt(rest.substring(0, delimiterPosition), 10);

    recordStartPosition = delimiterPosition + 1;
    recordEndPosition = recordStartPosition + recordLength;

    byteCorrection = countExtraCodepoints(rest, recordStartPosition, recordEndPosition)
    recordEndPosition -= byteCorrection;
      

    if (isNaN(recordLength) || rest.length < recordEndPosition) {
      return [records, rest];
    }

    record = (" " + rest.slice(recordStartPosition, recordEndPosition)).slice(1);
    rest = rest.substring(recordEndPosition);

    records.push(record);
  }

  return [records, rest];
};
