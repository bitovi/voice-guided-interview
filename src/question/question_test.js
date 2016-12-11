import 'steal-mocha';
import chai from 'chai';
import clone from 'steal-clone';
import List from 'can/list/'
import Map from 'can/map/';

let assert = chai.assert;

let vm, answers, mockConnection;

describe('voice-guided-interview/question', () => {
  beforeEach((done) => {
    mockConnection = {
      getList() {
        return Promise.resolve(answers);
      },
      save(ans) {
        return Promise.resolve(ans);
      }
    };

    clone({
      '../models/answer': {
        answerConnection: mockConnection,
        Answer: Map
      }
    })
    .import('./question')
    .then(({ ViewModel }) => {
      vm = new ViewModel();
      done();
    });
  });

  it('potentialAnswers', (done) => {
    answers = [ 1, 2 ];
    vm.bind('potentialAnswers', () => {
      assert.equal(vm.attr('potentialAnswers'), answers,
        'should get answers from answers service');
      done();
    });

    vm.attr('providedAnswer', 'foo');
  });

  describe('answer', () => {
    it('no potential answers', (done) => {
      answers = new List([]);
      vm.bind('potentialAnswers', () => {
        assert.equal(vm.attr('answer'), undefined);
        done();
      });
      vm.attr('providedAnswer', 'Pizza');
    });

    it('no potential answers above certainty threshhold', (done) => {
      answers = new List([{
        answer: 'Hello',
        certainty: 0.1
      }, {
        answer: 'World',
        certainty: 0.05
      }]);
      vm.bind('potentialAnswers', () => {
        assert.equal(vm.attr('answer'), undefined);
        done();
      });
      vm.attr('providedAnswer', 'Pizza');
    });

    it('one potential answer above certainty threshhold', (done) => {
      answers = new List([{
        answer: 'Hello',
        certainty: 0.3
      }, {
        answer: 'World',
        certainty: 0.05
      }]);
      vm.bind('potentialAnswers', () => {
        assert.equal(vm.attr('answer'), 'Hello');
        done();
      });
      vm.attr('providedAnswer', 'Pizza');
    });

    it('more than one potential answer above certainty threshhold', (done) => {
      answers = new List([{
        answer: 'Hello',
        certainty: 0.3
      }, {
        answer: 'World',
        certainty: 0.4
      }]);
      vm.bind('potentialAnswers', () => {
        assert.equal(vm.attr('answer'), 'World');
        done();
      });
      vm.attr('providedAnswer', 'Pizza');
    });
  });

  it('createAnswer', (done) => {
    vm.bind('potentialAnswers', () => {});
    vm.createAnswer('Salad', 'Sandwich')
      .then((ans) => {
        assert.equal(ans.attr('t'), 'Salad',
          'should create new Answer with correct `t` value');
        assert.equal(ans.attr('answer'), 'Sandwich',
          'should create new Answer with correct `answer` value');
        assert.deepEqual(vm.attr('answer'), ans.attr('answer'),
          'should set answer');
        done();
      });
  });
});
