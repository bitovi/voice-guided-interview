import QUnit from 'steal-qunit';
import { ViewModel } from './vgi-pagination';

// ViewModel unit tests
QUnit.module('voice-guided-interview/vgi-pagination');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the vgi-pagination component');
});
