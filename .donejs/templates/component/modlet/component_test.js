import 'steal-mocha';
import chai from 'chai';
import { ViewModel } from './<%= name %>';

let assert = chai.assert;

// ViewModel unit tests
describe('<%= module %>', () => {
  it('Has message', () => {
    var vm = new ViewModel();
    assert.equal(vm.attr('message'), 'This is the <%= tag %> component');
  });
});
