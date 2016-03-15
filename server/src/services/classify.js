const debug = require('debug')('VGI:services/classify');

module.exports = class CategoryService {
  constructor(classifier) {
    this.classifier = classifier;
  }

  create(data, params) {
    const { phrase, label } = data;

    debug('classifier.addDocument("' + phrase + '", ' + label + ')');
    this.classifier.addDocument(phrase, label);
    this.classifier.retrain();

    return Promise.resolve(data);
  }
};
