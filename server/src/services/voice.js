module.exports = class QuestionsService {
  constructor() {
    // train NaturalBrain with voice actions
  }

  find(params) {
    let results = [{
      action: 'navigate',
      subaction: 'next'
    }];
    console.log('find req:', params, 'res:', results);
    return Promise.resolve(results);
  }
};
