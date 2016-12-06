import can from 'can';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';
import 'can/map/define/define';

export const Question = can.Map.extend({
  define: {}
});

Question.List = can.List.extend({
  Map: Question
}, {});

export const questionConnection = superMap({
  url: '/api/questions',
  idProp: 'id',
  Map: Question,
  List: Question.List,
  name: 'question'
});

tag('question-model', questionConnection);

export default Question;
