'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const AnswerService = require('./services/answer');
const QuestionsService = require('./services/questions');
const Classifier = require('./classifier');
const debug = require('debug')('VGI:app');

const PORT = 3030;

const classifier = new Classifier().getClassifier();
const answerService = new AnswerService(classifier);
const questionsService = new QuestionsService(classifier);
classifier.train();

const app = feathers()
  .configure(rest())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

app.use('/answer', answerService);
app.use('/questions', questionsService);

app.listen(PORT, () => {
  console.log('server listening on port', PORT);
});
