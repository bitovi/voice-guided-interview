'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _navigateClassificati;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = require('debug')('VGI:services/voice');
var Classifier = require('natural-brain');

var nextQuestionLabelJSON = JSON.stringify({
  action: 'navigate',
  subaction: 'next'
});
var prevQuestionLabelJSON = JSON.stringify({
  action: 'navigate',
  subaction: 'prev'
});

var setAnswerLabel = {
  action: 'answer',
  subaction: 'set'
};
var removeAnswerLabel = {
  action: 'answer',
  subaction: 'remove'
};

var navigateClassifications = (_navigateClassificati = {}, _defineProperty(_navigateClassificati, nextQuestionLabelJSON, ['next question', 'next', 'forward', 'go forward']), _defineProperty(_navigateClassificati, prevQuestionLabelJSON, ['previous question', 'previous', 'back', 'go back']), _navigateClassificati);

function byValue(a, b) {
  return b.value - a.value;
}

module.exports = function () {
  function QuestionsService() {
    _classCallCheck(this, QuestionsService);
  }

  _createClass(QuestionsService, [{
    key: 'find',
    value: function find(params) {
      var _this = this;

      var answerFound = false;
      var results = [];
      var _params$query = params.query;
      var transcript = _params$query.transcript;
      var options = _params$query.options;
      var type = _params$query.type;


      options = options ? options.split(',') : options;

      debug(transcript);

      this.classifier = new Classifier();

      var _loop = function _loop(label) {
        navigateClassifications[label].forEach(function (phrase) {
          _this.classifier.addDocument(phrase, label);
        });
      };

      for (var label in navigateClassifications) {
        _loop(label);
      }

      if (options && type) {
        this.trainForAnswers(options, type);
      }

      this.classifier.train();

      var classifications = this.classifier.getClassifications(transcript).sort(byValue);

      classifications.forEach(function (c, i) {
        debug(classifications[i]);
      });

      if (classifications.length > 1) {
        var isAnswer = classifications[0].label.indexOf('"action":"answer"') >= 0;
        var isNavigate = classifications[0].label.indexOf('"action":"navigate"') >= 0;

        // if answers are answers, pick any over some number
        if (isAnswer) {
          answerFound = [];
          classifications.forEach(function (c) {
            if (c.label.indexOf('"action":"answer"') >= 0 && c.value > 0.15) {
              answerFound.push(c);
            }
          });
        }

        // if classification is 'navigate', pick top answer if it is bigger than next answer by at least 0.5
        if (isNavigate) {
          if (classifications[0].value - classifications[1].value > 0.5) {
            answerFound = classifications[0];
          }
        }
      }

      // if answer not found, assume text input
      if (!answerFound) {
        answerFound = {
          label: {
            action: 'answer',
            subaction: 'set',
            value: transcript
          }
        };
      }

      if (typeof answerFound.label === 'string') {
        results.push(JSON.parse(answerFound.label));
      } else if (Array.isArray(answerFound)) {
        answerFound.forEach(function (result) {
          results.push(JSON.parse(result.label));
        });
      } else {
        results.push(answerFound.label);
      }

      debug(results);

      return Promise.resolve(results);
    }
  }, {
    key: 'trainForAnswers',
    value: function trainForAnswers(options, type) {
      var _this2 = this;

      options.forEach(function (option) {
        var setAnswerClassifications = ['' + option, 'set ' + option, 'check ' + option];
        var removeAnswerClassifications = ['not ' + option, 'remove ' + option, 'uncheck ' + option];

        Object.assign(setAnswerLabel, { value: option });

        setAnswerClassifications.forEach(function (phrase) {
          _this2.classifier.addDocument(phrase, JSON.stringify(setAnswerLabel));
        });

        Object.assign(removeAnswerLabel, { value: option });

        removeAnswerClassifications.forEach(function (phrase) {
          _this2.classifier.addDocument(phrase, JSON.stringify(removeAnswerLabel));
        });
      });
    }
  }]);

  return QuestionsService;
}();