"use strict";

var chai = require("chai");
chai.use(require("chai-subset"));
var expect = chai.expect;

var object = require("../../lib/util/object.js");

describe("Object related utils", function() {

  describe("defaults", function() {
    it("should include only keys found in the default", function() {
      var dfl = {
        name: "A test",
        desc: "Testing, testing"
      };

      var val = {
        name: "A value",
        extra: "Don't want this"
      };

      expect(object.defaults(val, dfl))
        .to.deep.equal({
          name: "A value",
          desc: "Testing, testing"
        });

    });
  });

});
