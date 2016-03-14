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

  setCheckboxAnswer(el, val, checked) {
    const answers = [];
    const $el = (el.type === 'checkbox') ? $(el).parent().parent() : $(el);

    $el.find('input[type="checkbox"]').each((i, el) => {
      if (el.checked) {
        answers.push( $(el).attr('class') );
      }
    });

    this.attr('answer', answers);
  }
});

export default Component.extend({
  tag: 'vgi-question',
  viewModel: ViewModel,
  template,
  helpers: {
    getAnswer(val) {
      return 'answer.' + val;
    },

    toLowerCase(val) {
      return val.toLowerCase();
    }
  },

  events: {
    '{window} voice': function(el, ev, { action, value }) {
      if (action === 'answer') {
        this.viewModel.attr('answer', value);
      }
    }
  }

});
