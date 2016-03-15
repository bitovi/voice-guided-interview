'use strict';

var feathers = require('feathers');
var rest = require('feathers-rest');
var bodyParser = require('body-parser');
var AnswerService = require('./services/answer');
var QuestionsService = require('./services/questions');
var ClassifyService = require('./services/classify');
var Classifier = require('./classifier');
var debug = require('debug')('VGI:app');

var PORT = 3030;

var classifier = new Classifier().getClassifier();
var answerService = new AnswerService(classifier);
var questionsService = new QuestionsService(classifier);
var classifyService = new ClassifyService(classifier);

// train classifier once all services have been created
classifier.train();

var app = feathers().configure(rest()).use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

app.use('/answer', answerService);
app.use('/questions', questionsService);
app.use('/classify', classifyService);

app.listen(PORT, function () {
  console.log('server listening on port', PORT);
});