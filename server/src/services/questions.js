const BurgerService = require('./categories/burger');
const PizzaService = require('./categories/pizza');
const SandwichService = require('./categories/sandwich');

const debug = require('debug')('VGI:services/questions');

module.exports = class CategoryService {
  constructor(classifier) {
    this.classifier = classifier;

    this.categoriesServices = {
      burger: new BurgerService(classifier),
      pizza: new PizzaService(classifier),
      sandwich: new SandwichService(classifier)
    };

    this.questions = [{
      question: 'What do you want for lunch today?',
      variable: 'category',
      options: [
        'Burger',
        'Pizza',
        'Sandwich'
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
    const { category } = params.query;

    if (category) {
      return this.categoriesServices[category].find(params);
    } else {
      return Promise.resolve(this.questions);
    }
  }
};
