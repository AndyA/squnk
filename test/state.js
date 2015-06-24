"use strict";

var chai = require("chai");
chai.use(require("chai-subset"));
chai.use(require("chai-as-promised"));
var expect = chai.expect;

var _ = require("underscore");
var path = require("path");
var temp = require("temp");
temp.track();

var State = require("../lib/state/");

describe("state persistence", function() {

  describe("check with new file", function() {
    var stateFile = path.join(
      temp.mkdirSync("squnkstate"), "state.json");

    var st = new State(stateFile);
    var st2 = new State(stateFile);

    it("should initially be empty", function() {
      return expect(st.loadDeltas())
        .to.eventually.deep.equal([]);
    });

    it("should initially have no states", function() {
      return expect(st.loadDeltaStates())
        .to.eventually.deep.equal([]);
    });

    function makeStateWithState(sequence, state) {
      return {
        name: "test-" + sequence,
        sequence: sequence,
        state: state
      };
    }

    function makeDeltaWithState(sequence, state) {
      var delta = makeStateWithState(sequence, state);
      _.extend(delta, {
        meta: {
          description: "Test delta " + sequence
        }
      });
      return delta;
    }

    function makeState(sequence) {
      return makeStateWithState(sequence,
        sequence < 3 ? "deployed" : "pending");
    }

    function makeDelta(sequence) {
      return makeDeltaWithState(sequence,
        sequence < 3 ? "deployed" : "pending");
    }

    _.range(5)
      .forEach(function(sequence) {
        it("should save delta " + sequence, function() {
          return expect(st.saveDelta(makeDelta(sequence)))
            .to.eventually.be.not.null;
        });
      });

    it("should load all the deltas", function() {
      return expect(st.loadDeltas())
        .to.eventually.deep.equal(_.range(5)
          .map(makeDelta));
    });

    it("should load all the delta states", function() {
      return expect(st.loadDeltaStates())
        .to.eventually.deep.equal(_.range(5)
          .map(makeState));
    });

    _.shuffle(_.range(5))
      .forEach(function(sequence) {
        it("should load delta " + sequence, function() {
          return expect(st.loadDelta(sequence))
            .to.eventually.deep.equal(makeDelta(sequence));
        });
      });

    _.shuffle(_.range(5))
      .forEach(function(sequence) {
        it("should load delta " + sequence + " via a second State",
          function() {
            return expect(st2.loadDelta(sequence))
              .to.eventually.deep.equal(makeDelta(sequence));
          });
      });

    it("should set a different state", function() {
      return expect(st.setDeltaState(3, "deployed"))
        .to.eventually.be.not.null;
    });

    it("should have changed the state", function() {
      return expect(st.loadDelta(3))
        .to.eventually.deep.equal(makeDeltaWithState(3, "deployed"));
    });

  });

});
