import F from 'funcunit';
import mocha from 'steal-mocha';

F.attach(mocha);

describe('voice-guided-interview functional smoke test', () => {
  beforeEach(() => {
    F.open('../development.html');
  });

  it('voice-guided-interview main page shows up', () => {
    F('title').text('Voice Guided Interview', 'Title is set');
  });
});

