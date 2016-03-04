import QUnit from 'steal-qunit';
import { ViewModel } from './vgi-navigation';

// ViewModel unit tests
QUnit.module('voice-guided-interview/vgi-navigation');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the vgi-navigation component');
});
