"use strict";

var fs = require("fs");
var program = require("commander");
var Engine = require("./engine/");

var CONFIG = "./squnk.json";

module.exports = function(args) {
  var engine = new Engine();

  // Load config
  var config = JSON.parse(fs.readFileSync(CONFIG));

  // Load internal CLI plugins
  ["core"].forEach(function(mod) {
    engine.loadPlugin("../cli/" + mod + ".js");
  });

  engine.setup(config);

  engine.emit("cliSetup", program);
  program.parse(args);
};
