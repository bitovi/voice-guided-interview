import $ from 'jquery';
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './vgi-pagination.less!';
import template from './vgi-pagination.stache!';

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
  tag: 'vgi-pagination',
  viewModel: ViewModel,
  template,
  events: {
    '{window} voice': function(el, ev, action, subaction) {
      if (action === 'navigate') {
        if (subaction === 'next') {
          if (!this.viewModel.attr('lastPage')) {
            this.viewModel.next();
          }
        }

        if (subaction === 'prev') {
          if (!this.viewModel.attr('firstPage')) {
            this.viewModel.prev();
          }
        }
      }
    }
  },
  helpers: {
    plusOne(val) {
      return val + 1;
    }
  }
});
