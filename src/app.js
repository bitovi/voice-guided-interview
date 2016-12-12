import Map from "can/map/";
import route from "can/route/";

import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = Map.extend({
  define: {
    title: {
      type: 'string',
      value: 'Voice Guided Interview',
      serialize: false
    },
    questionNumber: {
      type: 'number',
      value: 0
    },
    page: {
      type: 'string',
      value: 'questions'
    }
  }
});

route('/:page');
route('/:page/:questionNumber', { page: 'questions' });
route.ready();

export default AppViewModel;
