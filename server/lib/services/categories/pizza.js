'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('VGI:services/categories/pizza');

module.exports = function () {
  function PizzaService(classifier) {
    _classCallCheck(this, PizzaService);

    this.classifier = classifier;

    this.questions = [{
      question: 'Do you want meat on your pizza?',
      variable: 'pizza-meat',
      options: ['Yes', 'No']
    }, {
      question: 'How much cheese do you want?',
      variable: 'pizza-cheese',
      options: ['Regular', 'Extra']
    }, {
      question: 'What would you like to drink?',
      variable: 'pizza-drink',
      options: ['Water', 'Soda', 'Lemonade']
    }];

    this.train();
  }

  _createClass(PizzaService, [{
    key: 'train',
    value: function train() {
      var _this = this;

      this.questions.forEach(function (question) {
        question.options.forEach(function (phrase) {
          var label = '{"type":"answer","value":"' + phrase + '"}';

          debug('classifier.addDocument("' + phrase + '", ' + label + ')');
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

  return PizzaService;
}();