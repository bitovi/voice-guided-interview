const debug = require('debug')('VGI:services/categories/burger');

module.exports = class BurgerService {
  constructor(classifier) {
    this.classifier = classifier;

    this.questions = [{
      question: 'What kind of meat do you like?',
      variable: 'burger-meat',
      options: [
        'Beef',
        'Turkey'
      ]
    }, {
      question: 'What kind of bun do you want?',
      variable: 'burger-bun',
      options: [
        'Wheat',
        'White',
        'Sesame'
      ]
    }];

    this.train();
  }

  train() {
    this.questions.forEach(question => {
      question.options.forEach(phrase => {
        const label = `{"type":"answer","value":"${phrase}"}`;

        debug('classifier.addDocument("' + phrase + '", ' + label + ')');
        this.classifier.addDocument(phrase, label);
      });
    });
  }

  find(params) {
    return Promise.resolve(this.questions);
  }
};
