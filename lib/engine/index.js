"use strict";

var util = require("util");
var events = require("events");
var _ = require("underscore");

function Engine() {
  events.EventEmitter.call(this);
  this.drivers = {};
  this.config = null;
}

util.inherits(Engine, events.EventEmitter);

Engine.prototype.applyDelta = function(delta) {
  console.log("applying " + delta);
};

Engine.prototype.loadPlugin = function(name, config) {
  console.log("Loading " + name);
  var plugin = require(name);
  plugin(this, config);
};

_.extend(Engine.prototype, require("./config.js"));
_.extend(Engine.prototype, require("./create.js"));
_.extend(Engine.prototype, require("./driver.js"));

Engine.prototype.setup = function(config) {
  this.config = config;

  // Load plugins
  if (config.plugins) {
    _.each(config.plugins, function(options, name) {
      this.loadPlugin(name, options);
    }, this);
  }

  // Make sure we have handlers for our database connections
  if (config.connections) {
    _.each(config.connections, function(uri) {
      this.findDriver(uri);
    }, this);
  }

};

module.exports = Engine;
