module.exports = class QuestionsService {
  constructor() {
    this.questions = [{
      type: 'text',
      question: 'What is your name?',
      variable: 'name'
    }, {
      type: 'date',
      question: "What is today's date?",
      variable: 'date'
    }, {
      type: 'radio',
      question: 'How old are you?',
      variable: 'age',
      options: [
        'Young',
        'Old'
      ]
    }, {
      type: 'checkbox',
      question: 'What type of fruit do you like?',
      variable: 'fruit',
      options: [
        'Apple',
        'Orange',
        'Pear',
        'Mango',
        'Peach'
      ]
    }, {
      type: 'textpick',
      question: 'What type of bear is best?',
      variable: 'bear',
      options: [
        'Black Bear',
        'Brown Bear',
        'Polar Bear',
        'Grizzly Bear',
        'Panda Bear'
      ] 
    }];
  }

  find(params) {
    return Promise.resolve(this.questions);
  }
};
