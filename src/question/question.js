import Component from 'can/component/';
import Map from 'can/map/';
import List from 'can/list/';
import template from './question.stache!';
import { answerConnection, Answer } from '../models/answer';

import 'can/map/define/';
import './question.less!';

export const ViewModel = Map.extend({
  define: {
    questionNumber: {
      type: 'number',
      set(val) {
        this.attr('providedAnswer', '');
        this.attr('answer', '');
        return val;
      }
    },
    providedAnswer: {
      type: 'string',
      value: ''
    },
    potentialAnswers: {
      get(lastSetVal, resolve) {
        const t = this.attr('providedAnswer');

        if (!t) {
          resolve(new List([]));
          return;
        }

        answerConnection
          .getList({ t })
          .then(resolve);
      }
    },
    answer: {
      get(lastSetVal) {
        var bestAnswer = new Map({ answer: undefined, certainty: 0.3 });

        if (lastSetVal) {
          return lastSetVal;
        }

        this.attr('potentialAnswers')
          .forEach((answer) => {
            if (answer.attr('certainty') >= bestAnswer.attr('certainty')) {
              bestAnswer = answer;
            }
          });

          return bestAnswer.attr('answer');
      }
    }
  },
  createAnswer: function(t, answer) {
    const vm = this;
    const ans = new Answer({ t, answer });

    return answerConnection
      .save( ans )
      .then((ans) => {
        vm.attr('answer', ans.attr('answer'));
        return ans;
      });
  }
});

export default Component.extend({
  tag: 'vgi-question',
  viewModel: ViewModel,
  template
});
