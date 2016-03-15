'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('VGI:services/classify');

module.exports = function () {
  function CategoryService(classifier) {
    _classCallCheck(this, CategoryService);

    this.classifier = classifier;
  }

  _createClass(CategoryService, [{
    key: 'create',
    value: function create(data, params) {
      var phrase = data.phrase;
      var label = data.label;


      debug('classifier.addDocument(' + phrase + ',' + label + ')');
      this.classifier.addDocument(phrase, label);
      this.classifier.retrain();

      return Promise.resolve(data);
    }
  }]);

  return CategoryService;
}();