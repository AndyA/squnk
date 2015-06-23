"use strict";

var program = require("commander");

module.exports = function(args) {
  ["core"].forEach(function(mod) {
    var m = require("./cli/" + mod + ".js");
    m(program);
  });
  program.parse(args);
};
