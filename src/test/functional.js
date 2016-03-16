import F from 'funcunit';
import QUnit from 'steal-qunit';

F.attach(QUnit);

QUnit.module('voice-guided-interview functional smoke test', {
  beforeEach() {
    F.open('../development.html');
  }
});

QUnit.test('voice-guided-interview main page shows up', function() {
  F('title').text('voice-guided-interview', 'Title is set');
});
