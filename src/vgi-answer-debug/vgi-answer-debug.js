import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './vgi-answer-debug.less!';
import template from './vgi-answer-debug.stache!';

export const ViewModel = Map.extend({
  define: {
    variablesAndAnswers: {
      get() {
        const questions = this.attr('questions');
        const answers = this.attr('answers');

        return questions.map((q, i)  => {
          return {
            variable: q.attr('variable'),
            answer: answers.attr(i)
          };
        });
      }
    }
  }
});

export default Component.extend({
  tag: 'vgi-answer-debug',
  viewModel: ViewModel,
  template,

  helpers: {
    display(val) {
      if (val && val.join) {
        return val.join(', ');
      }
      return val;
    }
  }
});
