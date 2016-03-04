'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const QuestionsService = require('./services/questions');

const PORT = 3030;

const app = feathers()
  .configure(rest())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

app.use('/questions', new QuestionsService());

app.listen(PORT, () => {
  console.log('server listening on port', PORT);
});
