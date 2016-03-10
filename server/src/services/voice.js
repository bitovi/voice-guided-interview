var debug = require('debug')('VGI:services/voice');
var Classifier = require('natural-brain');

const nextQuestionLabel = JSON.stringify({
  action: 'navigate',
  subaction: 'next'
});

const prevQuestionLabel = JSON.stringify({
  action: 'navigate',
  subaction: 'prev'
});

const classifications = {
  [nextQuestionLabel]: [
    'next question',
    'next',
    'forward',
    'go forward'
  ],
  [prevQuestionLabel]: [
    'previous question',
    'previous',
    'back',
    'go back'
  ]
};

const tolerance = 0.5;

function byValue(a, b) {
  return b.value - a.value;
}

module.exports = class QuestionsService {
  constructor() {
    this.classifier = new Classifier();

    for (let label in classifications) {
      classifications[label].forEach(phrase => {
        debug(phrase, ':', label);
        this.classifier.addDocument(phrase, label);
      });
    }

    this.classifier.train();
  }

  find(params) {
    let answerFound = false,
        results = [];

    debug(params.query.transcript);

    let classifications = this.classifier
      .getClassifications(params.query.transcript)
      .sort(byValue);

    if (classifications.length > 1) {
      if (classifications[0].value - classifications[1].value > tolerance) {
        answerFound = classifications[0];
      }
    }

    if (answerFound) {
      try {
        results.push( JSON.parse(answerFound.label) );
      } catch(e) {
        debug('Error parsing', answerFound.label);
      }
    } else {
      results.push({
        action: 'answer',
        subaction: 'set',
        value: params.query.transcript
      });
    }

    debug(results[0]);

    return Promise.resolve(results);
  }
};
