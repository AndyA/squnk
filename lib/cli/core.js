"use strict";

module.exports = function(program) {
  program.command("create <delta>")
    .action(function(delta) {
      console.log("creating " + delta);
    });

  program.command("apply [delta]")
    .action(function(delta) {
      console.log("applying " + delta);
    });
};
