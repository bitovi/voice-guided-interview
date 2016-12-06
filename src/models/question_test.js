import 'steal-mocha';
import chai from 'chai';
import Question from './question';
import './fixtures/questions';

let assert = chai.assert;

describe('models/question', () => {
  it('getList', (done) => {
    Question.getList({}).then(function(items) {
      assert.equal(items.length, 2);
      assert.equal(items.attr('0.description'), 'First item');
      done();
    });
  });
});
