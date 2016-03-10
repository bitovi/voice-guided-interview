'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classifications;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = require('debug')('VGI:services/voice');
var Classifier = require('natural-brain');

var nextQuestionLabel = JSON.stringify({
  action: 'navigate',
  subaction: 'next'
});

var prevQuestionLabel = JSON.stringify({
  action: 'navigate',
  subaction: 'prev'
});

var classifications = (_classifications = {}, _defineProperty(_classifications, nextQuestionLabel, ['next question', 'next', 'forward', 'go forward']), _defineProperty(_classifications, prevQuestionLabel, ['previous question', 'previous', 'back', 'go back']), _classifications);

var tolerance = 0.5;

function byValue(a, b) {
  return b.value - a.value;
}

module.exports = function () {
  function QuestionsService() {
    var _this = this;

    _classCallCheck(this, QuestionsService);

    this.classifier = new Classifier();

    var _loop = function _loop(label) {
      classifications[label].forEach(function (phrase) {
        debug(phrase, ':', label);
        _this.classifier.addDocument(phrase, label);
      });
    };

    for (var label in classifications) {
      _loop(label);
    }

    this.classifier.train();
  }

  _createClass(QuestionsService, [{
    key: 'find',
    value: function find(params) {
      var answerFound = false,
          results = [];

      debug(params.query.transcript);

      var classifications = this.classifier.getClassifications(params.query.transcript).sort(byValue);

      if (classifications.length > 1) {
        if (classifications[0].value - classifications[1].value > tolerance) {
          answerFound = classifications[0];
        }
      }

      if (answerFound) {
        try {
          results.push(JSON.parse(answerFound.label));
        } catch (e) {
          debug('Error parsing', answerFound.label);
        }
      } else {
        results.push({
          action: 'answer',
          subaction: 'set',
          value: params.query.transcript
        });
      }

      debug(results[0]);

      return Promise.resolve(results);
    }
  }]);

  return QuestionsService;
}();