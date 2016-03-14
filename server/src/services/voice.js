var debug = require('debug')('VGI:services/voice');
var Classifier = require('natural-brain');

const nextQuestionLabelJSON = JSON.stringify({
  action: 'navigate',
  subaction: 'next'
});
const prevQuestionLabelJSON = JSON.stringify({
  action: 'navigate',
  subaction: 'prev'
});

const setAnswerLabel = {
  action: 'answer',
  subaction: 'set'
};
const removeAnswerLabel = {
  action: 'answer',
  subaction: 'remove'
};

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
  find(params) {
    let answerFound = false;
    let results = [];
    let { transcript, options, type } = params.query;

    options = options ? options.split(',') : options;

    debug(transcript);

    this.classifier = new Classifier();

    for (let label in navigateClassifications) {
      navigateClassifications[label].forEach(phrase => {
        this.classifier.addDocument(phrase, label);
      });
    }

    if (options && type) {
      this.trainForAnswers(options, type);
    }

    this.classifier.train();

    let classifications = this.classifier
      .getClassifications(transcript)
      .sort(byValue);

    classifications.forEach((c, i) => {
      debug(classifications[i]);
    });

    if (classifications.length > 1) {
      let isAnswer = classifications[0].label.indexOf('"action":"answer"') >= 0;
      let isNavigate = classifications[0].label.indexOf('"action":"navigate"') >= 0;

      // if answers are answers, pick any over some number
      if (isAnswer) {
        answerFound = [];
        classifications.forEach(c => {
          if (c.label.indexOf('"action":"answer"') >= 0 && c.value > 0.15) {
            answerFound.push(c);
          }
        });
      }

      // if classification is 'navigate', pick top answer if it is bigger than next answer by at least 0.5
      if (isNavigate) {
        if (classifications[0].value - classifications[1].value > 0.5) {
          answerFound = classifications[0];
        }
      }
    }

    // if answer not found, assume text input
    if (!answerFound) {
      answerFound = {
        label: {
          action: 'answer',
          subaction: 'set',
          value: transcript
        }
      };
    }

    if (typeof answerFound.label === 'string') {
      results.push( JSON.parse(answerFound.label) );
    } else if (Array.isArray(answerFound)) {
      answerFound.forEach(result => {
        results.push( JSON.parse(result.label) );
      });
    } else {
      results.push(answerFound.label);
    }

    debug(results);

    return Promise.resolve(results);
  }

  trainForAnswers(options, type) {
    options.forEach(option => {
      const setAnswerClassifications = [
        `${option}`,
        `set ${option}`,
        `check ${option}`
      ];
      const removeAnswerClassifications = [
        `not ${option}`,
        `remove ${option}`,
        `uncheck ${option}`
      ];

      Object.assign(setAnswerLabel, { value: option });

      setAnswerClassifications.forEach(phrase => {
        this.classifier.addDocument(phrase, JSON.stringify(setAnswerLabel));
      });

      Object.assign(removeAnswerLabel, { value: option });

      removeAnswerClassifications.forEach(phrase => {
        this.classifier.addDocument(phrase, JSON.stringify(removeAnswerLabel));
      });
    });
  }
};
