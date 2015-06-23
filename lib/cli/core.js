"use strict";

module.exports = {
  loaded: function(engine) {
    engine.on("cliSetup", function(program) {
      program.command("create <delta>")
        .action(function(delta) {
          engine.createDelta(delta);
        });

      program.command("apply <delta>")
        .action(function(delta) {
          engine.applyDelta(delta);
        });
    });
  }
};
