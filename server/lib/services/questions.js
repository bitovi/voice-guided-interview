'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function QuestionsService() {
    _classCallCheck(this, QuestionsService);

    this.questions = [{
      type: 'text',
      question: 'What is your name?',
      variable: 'name'
    }, {
      type: 'date',
      question: "What is today's date?",
      variable: 'date'
    }, {
      type: 'radio',
      question: 'How old are you?',
      variable: 'age',
      options: ['Young', 'Old']
    }, {
      type: 'checkbox',
      question: 'What type of fruit do you like?',
      variable: 'fruit',
      options: ['Apple', 'Orange', 'Pear', 'Mango', 'Peach']
    }, {
      type: 'textpick',
      question: 'What type of bear is best?',
      variable: 'bear',
      options: ['Black Bear', 'Brown Bear', 'Polar Bear', 'Grizzly Bear', 'Panda Bear']
    }];
  }

  _createClass(QuestionsService, [{
    key: 'find',
    value: function find(params) {
      return Promise.resolve(this.questions);
    }
  }]);

  return QuestionsService;
}();