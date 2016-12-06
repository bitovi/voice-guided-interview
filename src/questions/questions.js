import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './questions.less!';
import template from './questions.stache!';
import { questionConnection } from '../models/question';

export const ViewModel = Map.extend({
  define: {
    questionsPromise: {
      get() {
        return questionConnection.getList({});
      }
    },
    questions: {
      get(lastSetVal, resolve) {
        this.attr('questionsPromise').then(resolve);
      }
    }
  }
});

export default Component.extend({
  tag: 'vgi-questions',
  viewModel: ViewModel,
  template
});
