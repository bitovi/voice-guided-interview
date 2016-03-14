'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navigateClassificati;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = require('debug')('VGI:services/voice');

var nextQuestionLabelJSON = JSON.stringify({
  action: 'navigate',
  value: 'next'
});
var prevQuestionLabelJSON = JSON.stringify({
  action: 'navigate',
  value: 'prev'
});

var navigateClassifications = (_navigateClassificati = {}, _defineProperty(_navigateClassificati, nextQuestionLabelJSON, ['next question', 'next', 'forward', 'go forward']), _defineProperty(_navigateClassificati, prevQuestionLabelJSON, ['previous question', 'previous', 'back', 'go back']), _navigateClassificati);

function byValue(a, b) {
  return b.value - a.value;
}

module.exports = function () {
  function QuestionsService(classifier) {
    var _this = this;

    _classCallCheck(this, QuestionsService);

    this.classifier = classifier;

    var _loop = function _loop(label) {
      navigateClassifications[label].forEach(function (phrase) {
        debug('classifier.addDocument(' + phrase + ',' + label + ')');
        _this.classifier.addDocument(phrase, label);
      });
    };

    for (var label in navigateClassifications) {
      _loop(label);
    }
  }

  _createClass(QuestionsService, [{
    key: 'find',
    value: function find(params) {
      var results = [];
      var _params$query = params.query;
      var transcript = _params$query.transcript;
      var options = _params$query.options;
      var type = _params$query.type;

      options = options ? options.split(',') : options;

      debug(transcript);

      var classifications = this.classifier.getClassifications(transcript).sort(byValue);

      classifications.forEach(function (c, i) {
        debug(classifications[i]);
      });

      if (classifications && classifications[0] && classifications[0].value > 0.3) {
        var answer = JSON.parse(classifications[0].label);
        debug('Found:', answer);
        return Promise.resolve([answer]);
      } else {
        debug('Answer not found');
        return Promise.reject('Answer not found');
      }
    }
  }]);

  return QuestionsService;
}();