const NaturalBrain = require('natural-brain');

module.exports = class Classifier {
  constructor() {
    this.classifications = [];
    this._classifier = new NaturalBrain();
  }

  getClassifier() {
    return this._classifier;
  }

  addDocument(phrase, label) {
    this.classifications.push({ phrase, label });
    this._classifier.addDocument(phrase, label);
  }

  train() {
    this._classifier.train();
  }

  retrain() {
    this._classifier = new NaturalBrain();
    this.classifications.forEach(({ phrase, label }) => {
      this._classifier.addDocument(phrase, label);
    });
    this._classifier.train();
  }
};
