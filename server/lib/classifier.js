'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NaturalBrain = require('natural-brain');

module.exports = function () {
  function Classifier() {
    _classCallCheck(this, Classifier);

    this.classifications = [];
    this._classifier = new NaturalBrain();
  }

  _createClass(Classifier, [{
    key: 'getClassifier',
    value: function getClassifier() {
      return this._classifier;
    }
  }, {
    key: 'addDocument',
    value: function addDocument(phrase, label) {
      phrase = phrase.toLowerCase();
      this.classifications.push({ phrase: phrase, label: label });
      this._classifier.addDocument(phrase, label);
    }
  }, {
    key: 'train',
    value: function train() {
      this._classifier.train();
    }
  }, {
    key: 'retrain',
    value: function retrain() {
      var _this = this;

      this._classifier = new NaturalBrain();
      this.classifications.forEach(function (_ref) {
        var phrase = _ref.phrase;
        var label = _ref.label;

        _this._classifier.addDocument(phrase, label);
      });
      this._classifier.train();
    }
  }]);

  return Classifier;
}();