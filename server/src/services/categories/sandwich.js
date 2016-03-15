const debug = require('debug')('VGI:services/categories/sandwich');

module.exports = class SandwichService {
  constructor(classifier) {
    this.classifier = classifier;

    this.questions = [{
      question: 'What kind of sandwich do you want?',
      variable: 'sandwich-meat',
      options: [
        'Ham',
        'Italian',
        'Meatball'
      ]
    }, {
      question: 'What kind of bread would you like?',
      variable: 'sandwich-bread',
      options: [
        'Whole Wheat',
        'Multigrain',
        'Flatbread'
      ]
    }, {
      question: 'Do you want chips?',
      variable: 'sandwich-chips',
      options: [
        'Potato Chips',
        'BBQ Chips',
        'No Chips'
      ]
    }];

    this.train();
  }

  train() {
    this.questions.forEach(question => {
      question.options.forEach(phrase => {
        const label = `{"type":"answer","value":"${phrase}"}`;

        debug('classifier.addDocument(' + phrase + ',' + label + ')');
        this.classifier.addDocument(phrase, label);
      });
    });
  }

  find(params) {
    return Promise.resolve(this.questions);
  }
};
