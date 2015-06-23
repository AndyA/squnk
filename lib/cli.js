"use strict";

var program = require("commander");
var Engine = require("./engine.js");

module.exports = function(args) {
  var engine = new Engine();
  ["core"].forEach(function(mod) {
    var m = require("./cli/" + mod + ".js");
    m.loaded(engine);
  });
  engine.emit("cliSetup", program);
  program.parse(args);
};
