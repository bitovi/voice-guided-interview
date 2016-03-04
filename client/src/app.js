import AppMap from "can-ssr/app-map";
import Map from 'can/map/'
import List from 'can/list/'
import route from "can/route/";
import questionsConnection from 'voice-guided-interview/models/questions';

import 'can/map/define/';
import 'can/route/pushstate/';

const AppViewModel = AppMap.extend({
  define: {
    title: {
      value: 'voice-guided-interview',
      serialize: false
    },
    questionsPromise: {
      get() {
        return questionsConnection.getList({});
      },
      serialize: false
    },
    questions: {
      get(last, setVal) {
        this.attr('questionsPromise').then(setVal);
      },
      Type: Map,
      serialize: false
    },
    currentQuestionIndex: {
      type: 'number',
      value: 0,
      serialize: false
    },
    answers: {
      Type: List,
      value: [],
      serialize: false
    }
  }
});

export default AppViewModel;
