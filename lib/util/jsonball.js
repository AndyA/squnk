"use strict";

var path = require("path");
var fs = require("fs");
var _ = require("underscore");
var files = require("./files.js");

module.exports = {

  pack: function(dir) {
    var ball = {};
    var queue = [null];
    while (queue.length) {
      var obj = queue.shift();
      var objPath = obj === null ? dir : path.join(dir, obj);
      var stat = fs.statSync(objPath);
      if (stat.isDirectory()) {
        var dirFiles = fs.readdirSync(objPath);
        Array.prototype.push.apply(queue, dirFiles.map(function(name) {
          return obj === null ? name : path.join(obj, name);
        }));
        continue;
      }
      var data = fs.readFileSync(objPath);
      ball[obj] = {
        data: data.toString(),
        mtime: stat.mtime.getTime()
      };
    }
    return ball;
  },

  unpack: function(dir, ball) {
    if (fs.existsSync(dir)) {
      throw new Error(dir + " already exists");
    }

    _.each(ball, function(info, name) {
      files.mkParentPathSync(name);
      fs.writeFileSync(name, info.data);
    });
  }

};
