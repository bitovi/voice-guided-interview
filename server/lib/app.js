'use strict';

var feathers = require('feathers');
var rest = require('feathers-rest');
var bodyParser = require('body-parser');
var AnswerService = require('./services/answer');
var QuestionsService = require('./services/questions');
var Classifier = require('./classifier');
var debug = require('debug')('VGI:app');

var PORT = 3030;

var classifier = new Classifier().getClassifier();
var answerService = new AnswerService(classifier);
var questionsService = new QuestionsService(classifier);
classifier.train();

var app = feathers().configure(rest()).use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

app.use('/answer', answerService);
app.use('/questions', questionsService);

app.listen(PORT, function () {
  console.log('server listening on port', PORT);
});