import QUnit from 'steal-qunit';
import { ViewModel } from './vgi-answer-debug';

// ViewModel unit tests
QUnit.module('voice-guided-interview/vgi-answer-debug');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the vgi-answer-debug component');
});
