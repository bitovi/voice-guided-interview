import Component from 'can/component/';
import Map from 'can/map/';
import List from 'can/list/';
import 'can/map/define/';
import './questions.less!';
import template from './questions.stache!';
import { questionConnection } from '../models/question';

export const ViewModel = Map.extend({
  define: {
    questionsPromise: {
      get() {
        return questionConnection.getList({
          category: this.attr('category')
        });
      }
    },
    questions: {
      get(lastSetVal, resolve) {
        this.attr('questionsPromise').then(data => {
          this.attr('answers', new Array(data.length));
          resolve(new List(data));
        });
      }
    },
    answers: {
      set(val) {
        if (this.attr('answers')) {
          this.attr('answers').forEach((ans, i) => {
            val[i] = ans;
          });
        }
        return new List(val);
      }
    },
    category: {
      get() {
        return this.attr('answers.0');
      }
    },
    currentQuestion: {
      get() {
        const num = this.attr('questionNumber');
        const questions = this.attr('questions');
        return questions && questions.attr(num);
      }
    },
    currentAnswer: {
      get() {
        const num = this.attr('questionNumber');
        const answers = this.attr('answers');
        return answers && answers.attr(num);
      }
    }
  }
});

export default Component.extend({
  tag: 'vgi-questions',
  viewModel: ViewModel,
  template
});
