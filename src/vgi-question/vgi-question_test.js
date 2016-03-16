import QUnit from 'steal-qunit';
import { ViewModel } from './vgi-question';

// ViewModel unit tests
QUnit.module('voice-guided-interview/vgi-questions/vgi-question');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the vgi-question component');
});
