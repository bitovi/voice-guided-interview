import $ from 'jquery';
import AppMap from "can-ssr/app-map";
import Map from 'can/map/'
import List from 'can/list/'
import route from "can/route/";
import questionsConnection from 'voice-guided-interview/models/questions';
import answerConnection from 'voice-guided-interview/models/answer';


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

    this.bind('category', (vm, category) => {
      if (category) {
        category = category.toLowerCase();
        questionsConnection.getList({ category })
          .then(newQs => {
            newQs.forEach(q => {
              this.attr('questions').push(q);
            });
          });
      }
    });
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
        this.attr('questionsPromise').then(qs => {
          setVal(new List(qs));
        });
      },
      Type: List,
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
    category: {
      get() {
        return this.attr('answers.0');
      }
    },
    showAnswerDebug: {
      type: 'boolean',
      value: true,
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
    },
    showPagination: {
      get() {
        this.attr('questions.length') > 1;
      },
      serialze: false
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

      if(transcripts.isFinal) {
        this.attr('transcript', transcripts[0].transcript);

        answerConnection
          .getList({ transcript: transcripts[0].transcript })
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
