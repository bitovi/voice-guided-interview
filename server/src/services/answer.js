const debug = require('debug')('VGI:services/voice');

const nextQuestionLabelJSON = JSON.stringify({
  type: 'navigate',
  value: 'next'
});
const prevQuestionLabelJSON = JSON.stringify({
  type: 'navigate',
  value: 'prev'
});

const navigateClassifications = {
  [nextQuestionLabelJSON]: [
    'next question',
    'next',
    'forward',
    'go forward'
  ],
  [prevQuestionLabelJSON]: [
    'previous question',
    'previous',
    'back',
    'go back'
  ]
};

function byValue(a, b) {
  return b.value - a.value;
}

module.exports = class QuestionsService {
  constructor(classifier) {
    this.classifier = classifier;

    for (let label in navigateClassifications) {
      navigateClassifications[label].forEach(phrase => {
        debug('classifier.addDocument(' + phrase + ',' + label + ')');
        this.classifier.addDocument(phrase, label);
      });
    }
  }

  find(params) {
    let results = [];
    let { answer, tolerance=0.3 } = params.query;

    debug(answer);

    let classifications = this.classifier
      .getClassifications(answer)
      .sort(byValue);

    classifications.forEach((c, i) => {
      debug(classifications[i]);
    });

    if (classifications && classifications[0] && classifications[0].value >= tolerance) {
      const answer = JSON.parse( classifications[0].label );
      debug('Found:', answer);
      return Promise.resolve([ answer ]);
    } else {
      debug('Answer not found');
      return Promise.reject([]);
    }
  }
};
