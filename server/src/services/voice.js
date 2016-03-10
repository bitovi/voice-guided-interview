var debug = require('debug')('VGI:services/voice');

module.exports = class QuestionsService {
  constructor() {
    // train NaturalBrain with voice actions
  }

  find(params) {
    let results;

    debug('FIND', params);

    if (!results) {
      results = [{
        action: 'answer',
        subaction: 'set',
        value: params.query.transcript
      }];
    }

    return Promise.resolve(results);
  }
};
