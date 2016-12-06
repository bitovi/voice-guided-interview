import AppViewModel from './app';
import chai from 'chai';
import clone from 'steal-clone';

import 'steal-mocha';

let assert = chai.assert;

let vm;

describe('AppViewModel', () => {
  beforeEach((done) => {
    clone({

    })
    .import('./app')
    .then((ViewModel) => {
      vm = new AppViewModel();
      done();
    });
  });

  it('Has title', () => {
    assert.equal(vm.attr('title'), 'Voice Guided Interview');
  });
});


