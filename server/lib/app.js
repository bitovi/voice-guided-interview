'use strict';

var feathers = require('feathers');
var rest = require('feathers-rest');
var bodyParser = require('body-parser');
var QuestionsService = require('./services/questions');
var VoiceService = require('./services/voice');

var PORT = 3030;

var app = feathers().configure(rest()).use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

app.use('/questions', new QuestionsService());
app.use('/voice', new VoiceService());

app.listen(PORT, function () {
  console.log('server listening on port', PORT);
});