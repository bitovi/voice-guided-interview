import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './vgi-question.less!';
import template from './vgi-question.stache!';

export const ViewModel = Map.extend({
  define: {
    answer: {
      get(last) {
        const index = this.attr('questionNumber');
        let currentValue = this.attr('answers').attr(index);

        if (!currentValue) {
          // default radio buttons to first option
          if (this.attr('type') === 'radio' && this.attr('options.length')) {
            currentValue = this.attr('options.0')
            this.attr('answers').attr(index, currentValue);
          }
        }

        return currentValue;
      },
      set(val) {
        const index = this.attr('questionNumber');
        this.attr('answers').attr(index, val);
        return val;
      }
    }
  },

  setCheckboxAnswer(val, checked) {
    const index = this.attr('questionNumber');
    let currentValue = this.attr('answers').attr(index);

    // handle clicking multiple checkboxes
    if (!currentValue) {
      currentValue = [ val ];
    } else {
      if (checked) {
        currentValue.push(val);
      } else {
        currentValue.splice(currentValue.indexOf(val), 1);
      }
    }

    this.attr('answer', currentValue);
  }
});

export default Component.extend({
  tag: 'vgi-question',
  viewModel: ViewModel,
  template,
  helpers: {
    getAnswer(val) {
      return 'answer.' + val;
    }
  },

  events: {
    '{window} voice': function(el, ev, { action, subaction, value }) {
      if (action === 'answer') {
        if (subaction === 'set') {
          this.viewModel.attr('answer', value);
        }
      }
    }
  },

});
