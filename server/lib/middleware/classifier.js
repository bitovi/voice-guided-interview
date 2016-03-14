"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next) {
  req.feathers.classifier = classifier;
  next();
};

var classifier = new Date();