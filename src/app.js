import Map from "can/map/";
import route from "can/route/";

import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = Map.extend({
  define: {
    title: {
      value: 'Voice Guided Interview',
      serialize: false
    },
    questionNumber: {
      type: 'number',
      value: 0
    }
  }
});

route('/');
route('/:questionNumber');

export default AppViewModel;
