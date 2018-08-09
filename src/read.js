"use strict";

var copychars = require("@dcos/copychars").default;

var RECORD_PATTERN = /^\d+\n.+/;

function countExtraCodepoints(string, start, end) {
    let extraCodePoints = 0;

    for(let i = 0; i < end - 1; i++) {
        let codePoint = string.charCodeAt(start + i);

        if (codePoint > 0x7f && codePoint <= 0x7ff) extraCodePoints++;
        else if (codePoint > 0x7ff && codePoint <= 0xffff) extraCodePoints += 1;
        else if (codePoint > 0xffff) extraCodePoints += 3;
        else if (isNaN(codePoint) && i != (end - 2)) extraCodePoints += 1;
        //console.log(codePoint.toString(16));
        i++;
    }

    // console.log("'"+string.substring(start,end - 1) + "' -> " + extraCodePoints + " (" + start +","+end+")")
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

    //Solves an issue with string.length where a character composed by multiple
    //codePoints, out of the ASCII range, (e.g. ß) makes us miss the size of the
    //message.
    byteCorrection = countExtraCodepoints(rest, recordStartPosition, recordEndPosition)
    recordEndPosition -= byteCorrection;

    if (isNaN(recordLength) || rest.length < recordEndPosition) {
      return [records, rest];
    }

    record = copychars(rest, recordStartPosition, recordLength - byteCorrection);
    rest = rest.substring(recordEndPosition);

    records.push(record);
  }

  return [records, rest];
};
