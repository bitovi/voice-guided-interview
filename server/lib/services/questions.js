'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BurgerService = require('./categories/burger');
var PizzaService = require('./categories/pizza');
var SandwichService = require('./categories/sandwich');

var debug = require('debug')('VGI:services/questions');

module.exports = function () {
  function CategoryService(classifier) {
    _classCallCheck(this, CategoryService);

    this.classifier = classifier;

    this.categoriesServices = {
      burger: new BurgerService(classifier),
      pizza: new PizzaService(classifier),
      sandwich: new SandwichService(classifier)
    };

    this.questions = [{
      question: 'What do you want for lunch today?',
      variable: 'category',
      options: ['Burger', 'Pizza', 'Sandwich']
    }];

    this.train();
  }

  _createClass(CategoryService, [{
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
      var category = params.query.category;


      if (category) {
        return this.categoriesServices[category].find(params);
      } else {
        return Promise.resolve(this.questions);
      }
    }
  }]);

  return CategoryService;
}();