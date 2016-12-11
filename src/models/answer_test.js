import 'steal-mocha';
import chai from 'chai';
import Answer from './answer';

let assert = chai.assert;

describe('models/answer', () => {
  it('getList', (done) => {
    Answer.getList().then(function(items) {
      assert.equal(items.length, 2);
      assert.equal(items.attr('0.description'), 'First item');
      done();
    });
  });
});
