"use strict";

var url = require("url");

module.exports = {
  registerDriver: function(kind, constructor) {
    var drivers = this.drivers;
    if (drivers.hasOwnProperty(kind)) {
      throw new Error("Driver for " + kind + " already registered");
    }
    drivers[kind] = constructor;
  },

  findDriver: function(uri) {
    var spec = url.parse(uri);
    var m = /^(\w+):$/.exec(spec.protocol);
    if (m === null) {
      throw new Error("Bad database URI: " + uri);
    }
    var kind = m[1];
    var drivers = this.drivers;
    if (!drivers.hasOwnProperty(kind)) {
      this.loadPlugin("squnk-driver-" + kind);
    }
    if (!drivers.hasOwnProperty(kind)) {
      throw new Error("Can't locate a driver for " + kind);
    }
    return drivers[kind];
  },

  getDriver: function(uri, config) {
    var Driver = this.findDriver(uri);
    return new Driver(config);
  }
};
