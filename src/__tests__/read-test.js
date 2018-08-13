"use strict";

var read = require("../read");

describe("read", function() {
  it("returns empty result given an empty input", function() {
    expect(read("")).toEqual([[], ""]);
  });

  it("returns a single record", function() {
    expect(read("5\n12345")).toEqual([["12345"], ""]);
  });

  it("returns multiple records", function() {
    expect(read("5\n123454\n12343\n123")).toEqual([
      ["12345", "1234", "123"],
      ""
    ]);
  });

  it("returns multiple records with utf8 characters", function() {
    expect(read("6\n1234ß4\n12343\n123")).toEqual([
      ["1234ß", "1234", "123"],
      ""
    ]);
  });

  it("reads multiple records with chinese characters", function() {
    expect(read("12\n電風魚愛12\n马头书黄")).toEqual([
      ["電風魚愛", "马头书黄"],
      ""
    ]);
  });

  it("reads records with japanese characters", function() {
    expect(
      read(
        "6\n海社24\n勉暑漢神福練者都18\n器殺祝節梅類3\n祖27\n勤穀視署層著諸難朗"
      )
    ).toEqual([
      ["海社", "勉暑漢神福練者都", "器殺祝節梅類", "祖", "勤穀視署層著諸難朗"],
      ""
    ]);
  });

  it("reads records with japanese characters", function() {
    expect(read("7\nStraße6\nöfter7\nGefühl9\nÄnderung")).toEqual([
      ["Straße", "öfter", "Gefühl", "Änderung"],
      ""
    ]);
  });

  it("returns multiple records with BMP and non BMP characters", function() {
    expect(read("6\n1234ß6\nß432114\n🤷‍♂️.")).toEqual([
      ["1234ß", "ß4321", "🤷‍♂️."],
      ""
    ]);
  });

  it("reads multiple records with non BMP characters", function() {
    expect(read("25\n–±μβα°𝕆𝒾𝌆21\n😂📚🙆‍♀️")).toEqual([
      ["–±μβα°𝕆𝒾𝌆", "😂📚🙆‍♀️"],
      ""
    ]);
  });

  it("reads multiple records with continuation byte character sequences", function() {
    expect(
      read(
        "32\nÄÅÇÉÑÖÜáàâäãåçéè32\nêëíìîïñóòôöõúùûü36\n†°¢£§•¶ß®©™´¨≠ÆØ39\n∞±≤≥¥µ∂∑∏π∫ªºΩæø"
      )
    ).toEqual([
      [
        "ÄÅÇÉÑÖÜáàâäãåçéè",
        "êëíìîïñóòôöõúùûü",
        "†°¢£§•¶ß®©™´¨≠ÆØ",
        "∞±≤≥¥µ∂∑∏π∫ªºΩæø"
      ],
      ""
    ]);
  });

  it("reads multiple records with different byte sequences character", function() {
    expect(
      read(
        "6\n¸ ˝ 12\n¯ ˘ ˙ ˚ 25\n Ò Ú Û Ù ı ˆ ˜ 52\n‡ · ‚ „ ‰ Â Ê Á Ë È Í Î Ï Ì Ó Ô 61\n– — “ ” ‘ ’ ÷ ◊ ÿ Ÿ ⁄ € ‹ › ﬁ ﬂ 49\n¿ ¡ ¬ √ ƒ ≈ ∆ « » … À Ã Õ Œ œ "
      )
    ).toEqual([
      [
        "¸ ˝ ",
        "¯ ˘ ˙ ˚ ",
        " Ò Ú Û Ù ı ˆ ˜ ",
        "‡ · ‚ „ ‰ Â Ê Á Ë È Í Î Ï Ì Ó Ô ",
        "– — “ ” ‘ ’ ÷ ◊ ÿ Ÿ ⁄ € ‹ › ﬁ ﬂ ",
        "¿ ¡ ¬ √ ƒ ≈ ∆ « » … À Ã Õ Œ œ "
      ],
      ""
    ]);
  });

  it("returns partial records", function() {
    expect(read("5\n1234")).toEqual([[], "5\n1234"]);
  });

  it("returns complete and partial records", function() {
    expect(read("5\n123452\n122\n21100\nf")).toEqual([
      ["12345", "12", "21"],
      "100\nf"
    ]);
  });

  it("works with a relatively long input", function() {
    expect(
      read(
        "1\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n11\n1"
      )
    ).toEqual([
      [
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1"
      ],
      ""
    ]);
  });
});
