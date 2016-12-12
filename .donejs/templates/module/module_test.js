import 'steal-mocha';
import chai from 'chai';
import module from './<%= name %>';

let assert = chai.assert;

describe('<%= module %>', () => {
  it('Initialized the module', () => {
    assert.equal(typeof module, 'function');
    assert.equal(module(), 'This is the <%= name %> module');
  });
});
