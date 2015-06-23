"use strict";

var path = require("path");
var fs = require("fs");
var _ = require("underscore");
var files = require("../util/files.js");
var object = require("../util/object.js");

module.exports = function(name, opts) {

  var dir = path.join(this.config("baseDir"), name);

  if (fs.existsSync(dir)) {
    throw new Error(dir + " already exists");
  }

  files.mkPathSync(dir);

  var templateDir = path.join(__dirname, "..", "templates");

  var spec = {
    index: "index.js",
    deploy: "deploy.sql",
    verify: "verify.sql",
    rollback: "rollback.sql"
  };

  var context = object.defaults(opts, {
    name: name,
    description: null
  });

  _.each(spec, function(dst, src) {
    var srcFile = path.join(templateDir, src + ".template");
    var dstFile = path.join(dir, dst);
    var srcData = fs.readFileSync(srcFile);
    var dstData = _.template(srcData.toString());
    fs.writeFileSync(dstFile, dstData(context));
  });

};
