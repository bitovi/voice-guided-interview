import $ from 'jquery';
import Component from 'can/component/';
import Map from 'can/map/';
import template from './voiceInput.stache!';

import 'can/map/define/';
import './voiceInput.less!';


const SpeechRecognition = window.SpeechRecognition ||
                          window.webkitSpeechRecognition ||
                          window.mozSpeechRecognition ||
                          window.msSpeechRecognition ||
                          window.oSpeechRecognition;

export const ViewModel = Map.extend({
  define: {
    listening: {
      type: 'boolean',
      value: false
    },
    transcript: {
      type: 'string'
    },
  },
  init() {
    if (System.isPlatform('window') && typeof SpeechRecognition === 'function') {
      this.recognition = new SpeechRecognition();
    } else {
      this.recognition = {
        start: $.noop,
        stop: $.noop
      };
    }
    this.recognition.onresult = this.handleVoiceCommand.bind(this);
    this.recognition.onend = this.stopListening.bind(this);
  },

  toggleListening() {
    if(this.attr('listening')) {
      this.stop();
    } else {
      this.attr('unknownVoiceCommand', false);
      this.start();
    }
  },

  handleVoiceCommand(event) {
    if (event.results.length > 0) {
      const transcripts = event.results[event.results.length-1];

      if(transcripts.isFinal) {
        this.attr('transcript', transcripts[0].transcript.toLowerCase());
        this.stop();
      }
    }
  },

  start() {
    this.attr('listening', true);
    this.recognition.start();
  },

  stopListening() {
    this.attr('listening', false);
  },

  stop() {
    this.recognition.stop();
  }
});

export default Component.extend({
  tag: 'vgi-voice-input',
  viewModel: ViewModel,
  template
});
