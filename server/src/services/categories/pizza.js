const debug = require('debug')('VGI:services/categories/pizza');

module.exports = class PizzaService {
  constructor(classifier) {
    this.classifier = classifier;

    this.questions = [{
      question: 'Do you want meat on your pizza?',
      variable: 'pizza-meat',
      options: [
        'Yes',
        'No'
      ]
    }, {
      question: 'How much cheese do you want?',
      variable: 'pizza-cheese',
      options: [
        'Regular',
        'Extra'
      ]
    }, {
      question: 'What would you like to drink?',
      variable: 'pizza-drink',
      options: [
        'Water',
        'Soda',
        'Lemonade'
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
