"use strict";

function SqunkError(message) {
  this.message = message;
  this.name = "SqunkError";
  Error.captureStackTrace(this, SqunkError);
}

SqunkError.prototype = Object.create(Error.prototype);
SqunkError.prototype.constructor = SqunkError;

module.exports = {
  SqunkError: SqunkError
};
