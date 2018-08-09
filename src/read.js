"use strict";

var copychars = require("@dcos/copychars").default;

var RECORD_PATTERN = /^\d+\n.+/;

function countExtraCodepoints(string, start, end) {
  let correctedLength = end - start;
  let length = end - start;
  for (let i = end - start; i >= start; i--) {
    const codePoint = string.charCodeAt(i);

    if (codePoint > 0x7f && codePoint <= 0x7ff) correctedLength++;
    else if (codePoint > 0x7ff && codePoint <= 0xffff) correctedLength += 2;

    if (codePoint >= 0xdc00 && codePoint <= 0xdfff) i--;
  }

  return correctedLength - length;
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

    //Solves an issue with string.length where a character composed by multiple
    //codePoints, out of the ASCII range, (e.g. ß) makes us miss the size of the
    //message.
    byteCorrection = countExtraCodepoints(
      rest,
      recordStartPosition,
      recordEndPosition
    );
    recordEndPosition -= byteCorrection;
    recordLength -= byteCorrection;

    if (isNaN(recordLength) || rest.length < recordEndPosition) {
      return [records, rest];
    }

    record = copychars(rest, recordStartPosition, recordLength);
    rest = rest.substring(recordEndPosition);

    records.push(record);
  }

  return [records, rest];
};
