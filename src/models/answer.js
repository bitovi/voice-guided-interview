import Map from 'can/map/';
import List from 'can/list/';
import connect from 'can-connect';
import $ from 'jquery';

import 'can-connect/constructor/';
import 'can-connect/can/map/';
import 'can-connect/can/';
import 'can-connect/constructor/store/';
import 'can-connect/constructor/callbacks-once/';
import 'can-connect/data/callbacks/';
import 'can-connect/data/callbacks-cache/';
import 'can-connect/data/combine-requests/';
import 'can-connect/data/inline-cache/';
import 'can-connect/data/localstorage-cache/';
import 'can-connect/data/parse/';
import 'can-connect/data/url/';
import 'can-connect/real-time/';
import 'can/map/define/define';

var behaviors = [
  'constructor',
  'can-map',
  'constructor-store',
  'data-callbacks',
  'data-combine-requests',
  'data-inline-cache',
  'data-parse',
  'data-url',
  'constructor-callbacks-once'
];

export const Answer = Map.extend({
  define: {}
});

Answer.List = List.extend({
  Map: Answer
}, {});

export const answerConnection = connect(behaviors, {
  ajax: $.ajax,
  url: '/api/answers',
  idProp: 'id',
  Map: Answer,
  List: Answer.List,
  name: 'answer'
});

export default Answer;
