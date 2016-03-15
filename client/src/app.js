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
    this.recognition.onresult = this.handleVoiceCommand.bind(this);
    this.recognition.onend = this.stopListening.bind(this);

    this.bind('currentQuestion', (ev, newVal, oldVal) => {
      if (newVal && oldVal && newVal.attr('question') !== oldVal.attr('question')) {
        const answer = this.attr('initialResponse');
        if (answer) {
          const options = newVal.attr('options')
            .map(o => {
              return `{"type":"answer","value":"${o}"}`
            })
            .serialize();
          this.checkAnswer({ answer, options, silent: true, tolerance: 0.1 });
        }
      }
    });
  },
  define: {
    title: {
      value: 'voice-guided-interview',
      serialize: false
    },
    questions: {
      get() {
        if (this.attr('preCategoryQuestions.length')) {
          return this.attr('preCategoryQuestions').concat(this.attr('postCategoryQuestions'));
        } else {
          return [];
        }
      },
      Type: List,
      serialize: false
    },
    preCategoryQuestions: {
      get(last, setVal) {
        questionsConnection
          .getList({})
          .then(qs => {
            setVal(new List(qs));
          });
      },
      Type: List,
      serialize: false
    },
    postCategoryQuestions: {
      get(last, setVal) {
        const category = this.attr('category');
        if (category) {
          questionsConnection
            .getList({
              category: category.toLowerCase()
            })
            .then(qs => {
              setVal(new List(qs));
            });
        } else {
          return [];
        }
      },
      Type: List,
      serialize: false
    },
    currentQuestionIndex: {
      type: 'number',
      value: 0,
      serialize: false,
      set(val) {
        this.attr('unknownVoiceCommand', false);
        return val;
      }
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
      set(val) {
        if (!this.attr('initialResponse')) {
          this.attr('initialResponse', val);
        }

        this.checkAnswer({ answer: val });

        return val;
      },
      serialize: false
    },
    initialResponse: {
      type: 'string',
      value: '',
      serialize: false
    },
    showPagination: {
      get() {
        this.attr('questions.length') > 1;
      },
      serialze: false
    },
    unknownVoiceCommand: {
      type: 'boolean',
      value: false,
      serialize: false
    }
  },

  checkAnswer({ answer, options=null, silent=false, tolerance=0.2 }) {
    const request = { answer, tolerance };
    if (options) {
      Object.assign(request, { options });
    }

    answerConnection
      .findAll(request)
      .then(resp => {
        resp.forEach(action => {
          $(window).trigger('voice', action);
        });
      }, err => {
        if (!silent) {
          this.attr('unknownVoiceCommand', true);
        }
      });
  },

  toggleAnswerDebug() {
    this.attr('showAnswerDebug', !this.attr('showAnswerDebug'));
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

export default AppViewModel;
