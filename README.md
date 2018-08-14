# RecordIO [![Build Status](https://travis-ci.org/dcos-labs/recordio.svg?branch=master)](https://travis-ci.org/dcos-labs/recordio)

---
👩‍🔬  Please be aware that this package is still experimental —
changes to the interface  and underlying implementation are likely,
and future development or maintenance is not guaranteed.

---

This package provides a function to read records in the RecordIO format from the input string.

## Usage

```javascript
import { read } from "@dcos/recordio";

const [records, rest] = read(input);
```

Function `read` returns a tuple whose first element is an array of records and the second element is the rest part of the input that is either empty or contains partial records.

## RecordIO format

Prepends to a single record its length in bytes, followed by a newline and then the data:

The BNF grammar for a RecordIO-encoded streaming response is:
```
records         = *record

record          = record-size LF record-data

record-size     = 1*DIGIT
record-data     = record-size(OCTET)
```
`record-size` should be interpreted as an unsigned 64-bit integer (uint64).

For example, a stream may look like:

```
121\n
{"type": "SUBSCRIBED","subscribed": {"framework_id": {"value":"12220-3440-12532-2345"},"heartbeat_interval_seconds":15.0}20\n
{"type":"HEARTBEAT"}675\n
...
```

Further documentation can be found in the [Apache Mesos documentation](http://mesos.apache.org/documentation/latest/scheduler-http-api/#recordio-response-format).

## Testing

The implementation is tested with different UTF-8 character sets to verify that it reads the correct number of bytes from the input string.

You can use the following python snippet to create test records from the provided messages array.

```python
messages = [u"foo", u"bar"]

for message in messages:
    chars = len(message)
    size = len(message.encode("utf-8"))
    print("Message")
    print("> Chars: %s" % chars)
    print("> Size: %s" % size)
    print("> Message: %s" % message)
    print("> Record: %s\\n%s" % (size, message))
```

Some of the tests use character sets from the [UTF-8 decoder capability and stress test](https://www.cl.cam.ac.uk/~mgk25/ucs/examples/UTF-8-test.txt) developed by [Markus Kuhn](http://www.cl.cam.ac.uk/~mgk25/) to ensure that parsing of character with different byte sequences works properly.
