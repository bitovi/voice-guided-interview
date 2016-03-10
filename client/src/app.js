import $ from 'jquery';
import AppMap from "can-ssr/app-map";
import Map from 'can/map/'
import List from 'can/list/'
import route from "can/route/";
import questionsConnection from 'voice-guided-interview/models/questions';
import voiceConnection from 'voice-guided-interview/models/voice';

import 'can/map/define/';
import 'can/route/pushstate/';


const SpeechRecognition = window.SpeechRecognition ||
                          window.webkitSpeechRecognition ||
                          window.mozSpeechRecognition ||
                          window.msSpeechRecognition ||
                          window.oSpeechRecognition;

const AppViewModel = AppMap.extend({
  init() {
    this.recognition = new SpeechRecognition();
    this.recognition.onresult = this.result.bind(this);
    this.recognition.onend = this.onEnd.bind(this);
  },
  define: {
    title: {
      value: 'voice-guided-interview',
      serialize: false
    },
    questionsPromise: {
      get() {
        return questionsConnection.getList({});
      },
      serialize: false
    },
    questions: {
      get(last, setVal) {
        this.attr('questionsPromise').then(setVal);
      },
      Type: Map,
      serialize: false
    },
    currentQuestionIndex: {
      type: 'number',
      value: 0,
      serialize: false
    },
    answers: {
      Type: List,
      value: [],
      serialize: false
    },
    showAnswerDebug: {
      type: 'boolean',
      value: false,
      serialize: false
    },
    listening: {
      type: 'boolean',
      value: false,
      serialize: false
    }
  },

  toggleAnswerDebug() {
    this.attr('showAnswerDebug', !this.attr('showAnswerDebug'));
  },

  toggleListening() {
    if(this.attr('listening')) {
      this.stop();
    } else {
      this.start();
    }
  },


  result(event) {
    if (event.results.length > 0) {
      let transcripts = event.results[event.results.length-1];
      if(transcripts.isFinal) {
        voiceConnection.getList({
          action: transcripts[0].transcript
        }).then(action => this.handleVoiceAction(action));
        this.stop();
      }
    }
  },

  start() {
    this.attr('listening', true);
    this.recognition.start();
  },

  onEnd() {
    this.attr('listening', false);
  },

  stop() {
    this.recognition.stop();
  },

  handleVoiceAction(action) {
    action.forEach(({ action, subaction }) => {
      $(window).trigger('voice', [action, subaction]);
    });
  }
});

export default AppViewModel;
