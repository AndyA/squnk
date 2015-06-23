"use strict";

var path = require("path");
var fs = require("fs");
var _ = require("underscore");
var files = require("../util/files.js");

module.exports = function(name /*, options*/ ) {

  var dir = path.join(this.config("baseDir"), name);
  files.mkPathSync(dir);

  var templateDir = path.join(__dirname, "..", "templates");

  var spec = {
    index: "index.js",
    deploy: "deploy.sql",
    verify: "verify.sql",
    rollback: "rollback.sql"
  };

  _.each(spec, function(dst, src) {
    var srcFile = path.join(templateDir, src + ".template");
    var dstFile = path.join(dir, dst);

    if (fs.existsSync(dstFile)) {
      throw new Error(dstFile + " already exists");
    }

    var srcData = fs.readFileSync(srcFile);
    var dstData = _.template(srcData.toString());
    fs.writeFileSync(dstFile, dstData({}));
  });

};
