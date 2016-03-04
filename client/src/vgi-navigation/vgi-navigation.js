import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './vgi-navigation.less!';
import template from './vgi-navigation.stache!';

export const ViewModel = Map.extend({
  define: {
    questionNumber: {
      type: 'number'
    },
    totalQuestions: {
      type: 'number',
      get() {
        return this.attr('questions.length');
      }
    },
    lastPage: {
      get() {
        return this.attr('questionNumber') === this.attr('totalQuestions') - 1;
      }
    },
    firstPage: {
      get() {
        return this.attr('questionNumber') === 0;
      }
    }
  },
  next() {
    this.attr('questionNumber', this.attr('questionNumber') + 1);
  },
  previous() {
    this.attr('questionNumber', this.attr('questionNumber') - 1);
  },
  goToPage(num) {
    this.attr('questionNumber', num);
  }
});

export default Component.extend({
  tag: 'vgi-navigation',
  viewModel: ViewModel,
  template,
  helpers: {
    plusOne(val) {
      return val + 1;
    }
  }
});
