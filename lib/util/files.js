"use strict";

var path = require("path");
var fs = require("fs");

function mkPath(pathName) {
  if (fs.existsSync(pathName)) {
    return;
  }
  mkPath(path.dirname(pathName));
  fs.mkdirSync(pathName);
}

module.exports = {
  mkPathSync: mkPath
};
