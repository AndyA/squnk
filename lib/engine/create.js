"use strict";

var path = require("path");
var fs = require("fs");
var _ = require("underscore");

module.exports = function(name) {

  var template = path.join(__dirname, "index.template");
  var baseDir = this.config("baseDir");
  var dir = path.join(baseDir, name);
  var indexFile = path.join(dir, "index.js");

  if (fs.existsSync(indexFile)) {
    throw new Error(indexFile + " already exists");
  }

  [baseDir, dir].forEach(function(d) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d);
    }
  });

  var src = fs.readFileSync(template);
  var index = _.template(src.toString());
  fs.writeFileSync(indexFile, index({}));
};
