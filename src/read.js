"use strict";

const { TextDecoder, TextEncoder } = require("text-encoding");

var copychars = require("@dcos/copychars").default;

var RECORD_PATTERN = /^\d+\n.+/;

/**
 *
 * @param {Uint8Array} byteArray byteArray to parse
 * @param {Uint8Array[]} records aray containing complete records
 * @returns {Uint8Array} incomplete record data, if existent
 */
function parseRecordsWithRest(byteArray, records) {
  if (byteArray.length === 0) {
    return new Uint8Array();
  }
  const newlineCharCode = 10;
  const zeroCharCode = 48;

  const newlineIndex = byteArray.findIndex(
    charCode => charCode == newlineCharCode
  );

  const recordSize = byteArray
    .slice(0, newlineIndex)
    .reduce((acc, val, index, array) => {
      return (
        acc + (val - zeroCharCode) * Math.pow(10, array.length - 1 - index)
      );
    }, 0);

  if (byteArray.length <= newlineIndex + recordSize) {
    return byteArray;
  }

  const record = byteArray.slice(
    newlineIndex + 1,
    newlineIndex + recordSize + 1
  );
  records.push(record);

  return parseRecordsWithRest(
    byteArray.slice(newlineIndex + recordSize + 1),
    records
  );
}

function read_multibyte(input) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder("utf-8");
  const byteArray = encoder.encode(input);
  const records = [];
  const rest = parseRecordsWithRest(byteArray, records);

  return [records.map(record => decoder.decode(record)), decoder.decode(rest)];
}

function read_ascii(input) {
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
}

module.exports = function read(input) {
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) > 127) {
      return read_multibyte(input);
    }
  }
  return read_ascii(input);
};
