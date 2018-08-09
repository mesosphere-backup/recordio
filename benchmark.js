const Benchmark = require("benchmark");
const original = require("./src/read-original");
const firstFix = require("./src/read-first-fix");
const read = require("./src/read");
const readNew = require("./src/read-no-regex-optimization");

const suite = new Benchmark.Suite;
const payload = "6\n1234ß4\n12343\n123";

suite
.add("Original", function() {
    original(payload);
})
.add("First Solution", function() {
    firstFix(payload);
})
.add("New Solution", function() {
    readNew(payload);
})
.add("New Solution + regex optimization", function() {
    read(payload);
})

.on("cycle", function(event) {
    console.log(String(event.target));
})
.on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
})
.run({ "async": true });
