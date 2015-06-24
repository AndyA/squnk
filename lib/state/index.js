"use strict";

var _ = require("underscore");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

function State(stateFile) {
  this.stateFile = stateFile;
  this.stateData = null;
}

function isNotFound(e) {
  return e !== null && e.isOperational && e.code === "ENOENT";
}

function loadFile(name, def) {
  return fs.readFileAsync(name)
    .then(function(data) {
      return JSON.parse(data);
    })
    .catch(isNotFound, function() {
      return def;
    });
}

function saveFile(name, data) {
  var tmpName = name + ".tmp";
  return fs.writeFileAsync(tmpName, JSON.stringify(data, null, 2))
    .then(function() {
      fs.renameAsync(tmpName, name);
    });
}

function stateOnly(delta) {
  return _.pick(delta, "name", "sequence", "state");
}

_.extend(State.prototype, {
  loadFile: function() {
    if (this.stateData) {
      return Promise
        .resolve(this.stateData)
        .bind(this);
    }
    return loadFile(this.stateFile, {
        deltas: []
      })
      .bind(this)
      .then(function(data) {
        this.stateData = data;
        return this.stateData;
      });
  },

  saveFile: function() {
    if (!this.stateData) {
      throw new Error("Attempt to save without loading");
    }
    return saveFile(this.stateFile, this.stateData);
  },

  saveDelta: function(delta) {
    return this.loadFile()
      .then(function(data) {
        var deltas = data.deltas;
        if (delta.sequence < 0 || delta.sequence > deltas.length) {
          throw new Error("Delta sequence out of range 0.." + deltas.length);
        }
        deltas[delta.sequence] = delta;
        return this.saveFile();
      });
  },

  loadDelta: function(sequence) {
    return this.loadDeltas()
      .then(function(deltas) {
        if (sequence < 0 || sequence >= deltas.length) {
          return null;
        }
        return deltas[sequence];
      });
  },

  loadDeltas: function() {
    return this.loadFile()
      .then(function(data) {
        return data.deltas;
      });
  },

  loadDeltaStates: function() {
    return this.loadDeltas()
      .then(function(deltas) {
        return deltas.map(stateOnly);
      });
  },

  setDeltaState: function(sequence, state) {
    return this.loadDelta(sequence)
      .then(function(delta) {
        delta.state = state;
        return this.saveDelta(delta);
      });
  }

});

module.exports = State;
