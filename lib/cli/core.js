"use strict";

module.exports = {
  loaded: function(engine) {
    engine.on("cliSetup", function(program) {
      program.command("create <delta>")
        .description("Create a new delta")
        .option("-m, --message <description>")
        .action(function(delta, options) {
          engine.createDelta(delta, options);
        });

      program.command("apply <delta>")
        .action(function(delta) {
          engine.applyDelta(delta);
        });
    });
  }
};
