import 'steal-mocha';
import chai from 'chai';
import clone from 'steal-clone';

let assert = chai.assert;
let vm, noCategoryQuestions, pizzaQuestions;

describe('voice-guided-interview/questions', () => {
  beforeEach((done) => {
    noCategoryQuestions = [{
    }];

    pizzaQuestions = [{
    }]

    clone({
    })
    .import('./questions')
    .then(({ ViewModel }) => {
      vm = new ViewModel();
      done();
    });
  });

  it('questions', () => {
    assert.equal(vm.attr('questions.0.length'), 1, 'Should have 1 question');
  });
});
