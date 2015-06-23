"use strict";

var fs = require("fs");

var CONFIG = "./squnk.json";

var config = null;

module.exports = function() {

  if (null === config) {
    config = JSON.parse(fs.readFileSync(CONFIG));
  }

  var cfg = config;
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i].split('.');
    for (var j = 0; j < arg.length; j++) {
      if (cfg === undefined || !(typeof cfg === "object")) {
        return null;
      }
      cfg = cfg[arg[j]];
    }
  }

  return cfg;
};
