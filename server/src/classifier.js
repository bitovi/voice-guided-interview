const NaturalBrain = require('natural-brain');

module.exports = class Classifier {
  constructor() {
    this.classifier = new NaturalBrain();
  }

  getClassifier() {
    return this.classifier;
  }

  train() {
    this.classifier.train();
  }
};
