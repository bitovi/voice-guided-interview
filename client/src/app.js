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
    if (System.isPlatform('window')) {
      this.recognition = new SpeechRecognition();
    } else {
      this.recognition = {
        start: $.noop,
        stop: $.noop
      };
    }
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
    currentQuestion: {
      get() {
        if (this.attr('questions')) {
          return this.attr('questions')[this.attr('currentQuestionIndex')];
        }
      }
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
    },
    transcript: {
      type: 'string',
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
      const transcripts = event.results[event.results.length-1];
      const index = this.attr('currentQuestionIndex');
      const currentQuestion = this.attr('questions')[index];
      const options = currentQuestion.options;
      const type = currentQuestion.type;

      if(transcripts.isFinal) {
        this.attr('transcript', transcripts[0].transcript);

        const request = {
          transcript: transcripts[0].transcript
        };

        if (options) {
          Object.assign(request, { options });
        }

        if (type) {
          Object.assign(request, { type });
        }

        voiceConnection
          .getList(request)
          .then(resp => {
            resp.forEach(action => {
              $(window).trigger('voice', action);
            });
          });

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
  }
});

export default AppViewModel;
