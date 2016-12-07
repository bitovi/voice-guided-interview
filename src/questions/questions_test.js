import 'steal-mocha';
import chai from 'chai';
import clone from 'steal-clone';

let assert = chai.assert;
let vm, noCategoryQuestions, pizzaQuestions;

describe('voice-guided-interview/questions', () => {
  beforeEach((done) => {
    noCategoryQuestions = [{
      prompt: "What would you like for lunch?",
    }];

    pizzaQuestions = [{
      prompt: "What would you like for lunch?",
    }, {
      prompt: "What kind of meat would you like on your pizza?",
    }, {
      prompt: "How much cheese would you like?",
    }, {
      prompt: "What kind of sauce would you like?",
    }]

    clone({
      '../models/question': {
        questionConnection: {
          getList({category}) {
            const questions = category ? pizzaQuestions : noCategoryQuestions;
            return Promise.resolve(questions);
          }
        }
      }
    })
    .import('./questions')
    .then(({ ViewModel }) => {
      vm = new ViewModel({
        questionNumber: 0
      });
      done();
    });
  });

  describe('category=null', () => {
    beforeEach((done) => {
      vm.bind('questions', () => done());
    });

    it('questions', () => {
      assert.deepEqual(vm.attr('questions').serialize(), noCategoryQuestions,
        'Should have 1 question');
    });

    it('answers', () => {
      assert.equal(vm.attr('answers.length'), vm.attr('questions.length'),
        'Should have 1 answer for each question');
    });

    it('currentQuestion', () => {
      assert.deepEqual(vm.attr('currentQuestion'), vm.attr('questions.0'),
        'Should show question 0');
    });

    it('currentAnswer', () => {
      assert.deepEqual(vm.attr('currentAnswer'), vm.attr('answers.0'),
        'Should show answers 0');
    });
  });

  describe('category=Pizza', () => {
    beforeEach((done) => {
      vm.bind('questions', (ev, questions) => {
        if (questions.length === 4) {
          done();
        } else {
          vm.attr('answers.0', 'Pizza');
        }
      });
    });

    it('category', () => {
      assert.equal(vm.attr('category'), 'Pizza');
    });

    it('questions', () => {
      assert.deepEqual(vm.attr('questions').serialize(), pizzaQuestions,
        'Should have 4 questions');
    });

    it('answers', () => {
      assert.equal(vm.attr('answers.length'), vm.attr('questions.length'),
        'Should have 1 answer for each question');
      assert.equal(vm.attr('answers.0'), 'Pizza',
        'Should not unset answers.0');
    });

    it('currentQuestion', () => {
      assert.deepEqual(vm.attr('currentQuestion'), vm.attr('questions.0'),
        'Should show question 0');

      vm.attr('questionNumber', 1);

      assert.deepEqual(vm.attr('currentQuestion'), vm.attr('questions.1'),
        'Should show question 1');
    });

    it('currentAnswer', () => {
      assert.deepEqual(vm.attr('currentAnswer'), vm.attr('answers.0'),
        'Should show answers 0');

      vm.attr('questionNumber', 1);

      assert.deepEqual(vm.attr('currentAnswer'), vm.attr('answers.1'),
        'Should show answers 1');
    });
  });
});
