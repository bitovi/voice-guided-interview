import 'steal-mocha';
import chai from 'chai';
import { ViewModel } from './<%= name %>';

let assert = chai.assert;

describe('<%= module %>', () => {
  it('Has message', () => {
    var vm = new ViewModel();
    assert.equal(vm.attr('message'), 'This is the <%= tag %> component');
  });
});
