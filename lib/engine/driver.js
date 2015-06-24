"use strict";

var url = require("url");
var errors = require("../errors/");

module.exports = {
  registerDriver: function(kind, constructor) {
    var drivers = this.drivers;
    if (drivers.hasOwnProperty(kind)) {
      throw new errors.SqunkError("Driver for " + kind +
        " already registered");
    }
    drivers[kind] = constructor;
  },

  findDriver: function(uri) {
    var spec = url.parse(uri);
    var m = /^(\w+):$/.exec(spec.protocol);
    if (m === null) {
      throw new errors.SqunkError("Bad database URI: " + uri);
    }
    var kind = m[1];
    var drivers = this.drivers;
    if (!drivers.hasOwnProperty(kind)) {
      this.loadPlugin("squnk-driver-" + kind);
    }
    if (!drivers.hasOwnProperty(kind)) {
      throw new errors.SqunkError("Can't locate a driver for " + kind);
    }
    return drivers[kind];
  },

  getDriver: function(uri, config) {
    var Driver = this.findDriver(uri);
    return new Driver(config);
  }
};
