"use strict";

var _ = require("underscore");

module.exports = {
  defaults: function(obj, dfl) {
    // Only include keys contained in dfl
    var out = {};
    _.each(dfl, function(v, k) {
      out[k] = obj.hasOwnProperty(k) ? obj[k] : v;
    });
    return out;
  }
};
