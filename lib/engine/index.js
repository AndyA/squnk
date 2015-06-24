"use strict";

var _ = require("underscore");
var events = require("events");
var path = require("path");
var util = require("util");
var winston = require("winston");

var State = require("../state/");

function Engine() {
  events.EventEmitter.call(this);
  this.drivers = {};
  this.config = null;
  this.state = null;

  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    colorize: true,
    timestamp: true
  });

  this.logger = winston;
}

util.inherits(Engine, events.EventEmitter);

Engine.prototype.log = function() {
  var logger = this.logger;
  if (logger !== null) {
    logger.log.apply(logger, _.toArray(arguments));
  }
};

Engine.prototype.applyDelta = function(delta) {
  this.log("info", "applying " + delta);
};

Engine.prototype.loadPlugin = function(name, config) {
  this.log("info", "Loading " + name);
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

  // Create state object
  var stateFile = path.join(config.baseDir, "squnkstate.json");
  this.state = new State(stateFile);

};

module.exports = Engine;
