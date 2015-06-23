"use strict";

var path = require("path");
//var _ = require("underscore");

module.exports = function(name) {

  var template = path.join(__dirname, "index.template");
  var dir = path.join(this.config("baseDir"), name);
  console.log("template: " + template);
  console.log("dir: " + dir);
};
