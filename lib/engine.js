"use strict";

var util = require("util");
var events = require("events");

function Engine() {
  events.EventEmitter.call(this);
}

util.inherits(Engine, events.EventEmitter);

Engine.prototype.applyDelta = function(delta) {
  console.log("applying " + delta);
}

Engine.prototype.createDelta = require("./engine/create.js");
Engine.prototype.config = require("./engine/config.js");

module.exports = Engine;
