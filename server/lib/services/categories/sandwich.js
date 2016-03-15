'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('VGI:services/categories/sandwich');

module.exports = function () {
  function SandwichService(classifier) {
    _classCallCheck(this, SandwichService);

    this.classifier = classifier;

    this.questions = [{
      question: 'What kind of sandwich do you want?',
      variable: 'sandwich-meat',
      options: ['Ham', 'Italian', 'Meatball']
    }, {
      question: 'What kind of bread would you like?',
      variable: 'sandwich-bread',
      options: ['Whole Wheat', 'Multigrain', 'Flatbread']
    }, {
      question: 'Do you want chips?',
      variable: 'sandwich-chips',
      options: ['Potato Chips', 'BBQ Chips', 'No Chips']
    }];

    this.train();
  }

  _createClass(SandwichService, [{
    key: 'train',
    value: function train() {
      var _this = this;

      this.questions.forEach(function (question) {
        question.options.forEach(function (phrase) {
          var label = '{"type":"answer","value":"' + phrase + '"}';

          debug('classifier.addDocument(' + phrase + ',' + label + ')');
          _this.classifier.addDocument(phrase, label);
        });
      });
    }
  }, {
    key: 'find',
    value: function find(params) {
      return Promise.resolve(this.questions);
    }
  }]);

  return SandwichService;
}();