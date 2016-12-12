import 'steal-mocha';
import chai from 'chai';
import { ViewModel } from './voiceInput';

let assert = chai.assert;

describe('voice-guided-interview/voiceInput', () => {
  it('listening', () => {
    var vm = new ViewModel();
    assert.equal(vm.attr('listening'), false);
  });
});
