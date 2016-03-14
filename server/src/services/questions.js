module.exports = class QuestionsService {
  constructor() {
    this.questions = [{
      type: 'text',
      question: 'What is your favorite fruit?',
      variable: 'favorite'
    }, {
      type: 'radio',
      question: 'Which fruit is red?',
      variable: 'red',
      options: [
        'Strawberry',
        'Mango'
      ]
    }, {
      type: 'checkbox',
      question: 'What type of fruit do you like?',
      variable: 'fruit',
      options: [
        'Apple',
        'Orange',
        'Banana',
        'Peach'
      ]
    }];
  }

  find(params) {
    return Promise.resolve(this.questions);
  }
};
