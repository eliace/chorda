import {Html, Domain, Binder, bindDomain as Bind, Layout, joint as bind, Config} from 'chorda-core'
import {Layouts, Tabs, Button} from 'chorda-bulma'

import {Mutate} from '../helpers'
import _ from 'lodash'
import axios from 'axios'


const api = {
  getYesNo: function (question) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {resolve({answer: question + '!!!'})}, 1500)
//      setTimeout(() => {reject('No luck')}, 1500)
    })
    .then(x => {
      console.log('actual result', x)
      return x
    })
//    return axios.get('https://yesno.wtf/api')
  }
}


export default () => {
  return {
    layout: Layouts.Rows,
    items: [{
      sources: {
        data: {
          message: 'Привет'
        }
      },
      $example: {
        id: 'example',
        $message: {
          html: 'p',
          dataChanged: function (v) {
            this.opt('text', v)
          },
          dataId: 'message'
        }
      },
      $bindExample: {
        $message: {
          html: 'p',
          text: bind('data', 'message')
        }
      }
    }, {
      sources: {
        data: new Domain({
          message: 'Привет'
        }, {
          properties: {
            reversedMessage: {
              calc: function (v) {
                return v.message.split('').reverse().join('')
              }
            }
          }
        })
      },
      $example: {
        id: 'example',
        $message: {
          html: 'p',
          text: bind('data', v => 'Изначальное сообщение: «'+v.message+'»')
        },
        $reversedMessage: {
          html: 'p',
          dataChanged: Mutate.Text,
          dataId: 'reversedMessage',
          format: v => 'Сообщение задом наперёд: «'+v+'»'
        }
      }
    }, {
      sources: {
        data: new Domain({}, {
          properties: {
            now: {
              calc: function (v) {
                return Date.now()
              }
            }
          }
        })
      },
      $example: {
        $button: {
          as: Button,
          text: 'Click me',
          onClick: function (e, {data}) {
            data._update()
          }
        },
        $info: {
          html: 'p',
          dataId: 'now',
          dataChanged: Mutate.Text //Bind.data('now')
        }
      }
    }, {
      sources: {
        data: new Domain({
          question: '',
          answer: 'Пока вы не зададите вопрос, я не могу ответить!'
        }, {
          watchers: {
            questionChanged: e => (e.name == 'changed' || e.name == 'init') && e.ids && ('question' in e.ids),
            answerFailed: (e, {getAnswer}) => e.name == getAnswer.fail,
//            debouncedGetAnswer: (e, {getAnswer}) => e.name == getAnswer.init
          },
          listeners: {
            answerFailed: function (e) {
              this.set('answer', 'Ошибка! Не могу связаться с API. ' + e.data)
            },
            questionChanged: function () {
              this.set('answer', 'Ожидаю, когда вы закончите печатать...')
              this.debouncedGetAnswer()
            },
            // debounce: (e) => {
            //   e.conflict = 'cancel'
            //   return new Promise(function (resolve) {
            //     setTimeout(() => resolve(), 500)
            //   })
            // }
          },
          methods: {
            getAnswer: async function () {
              const v = this.$get()
              if (v.question.indexOf('?') === -1) {
                this.set('answer', 'Вопросы обычно заканчиваются вопросительным знаком. ;-)')
                return
              }

              this.$set('answer', 'Думаю...')
              const response = await api.getYesNo(v.question)
              this.$set('answer', _.capitalize(response.answer))
            },
            debouncedGetAnswer: _.debounce(function () {
              this.getAnswer()
            }, 500),
            // answerFailed: function (error) {
            //   this.set('answer', 'Ошибка! Не могу связаться с API. ' + error)
            // },
            // debouncedLoadAnswer: _.debounce(function () {
            //   this.loadAnswer()
            // }, 500),
            // _getAnswer: function () {
            //   const v = this.get()
            //   if (v.question.indexOf('?') === -1) {
            //     this.set('answer', 'Вопросы обычно заканчиваются вопросительным знаком. ;-)')
            //     return
            //   }
            //   this.set('answer', 'Думаю...')
            //   var src = this
            //   axios.get('https://yesno.wtf/api')
            //     .then(function (response) {
            //       src.set('answer', _.capitalize(response.data.answer))
            //     })
            //     .catch(function (error) {
            //       src.set('answer', 'Ошибка! Не могу связаться с API. ' + error)
            //     })
            // },
            // _updateQuestion (v) {
            //   if (!this.debouncedGetAnswer) {
            //     this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
            //   }
            //   this.set('question', v)
            //   this.set('answer', 'Ожидаю, когда вы закончите печатать...')
            //   this.debouncedGetAnswer()
            // }
          }
        })
      },
      $example: {
        $input: {
          html: 'input',
          onChange: function (e, {data}) {
            data.$set('question', e.target.value)//.updateQuestion(e.target.value)//.getAnswer()//.entry('question').set(e.target.value)
          }
        },
        $info: {
          html: 'p',
          dataChanged: Mutate.Text,
          dataId: 'answer'
        }
      }
    }, {
      sources: {
        data: new Domain({
          question: '',
          answer: 'Пока вы не зададите вопрос, я не могу ответить!'
        }, {
          logEvents: true,
          watchers: {
            questionChanged: e => (e.name == 'changed' || e.name == 'init') && e.ids && ('question' in e.ids),
//            waitAsk: (e, {ask}) => e.name == ask.init,
            debounceAsk: {
//              policy: 'exclusive',
              when: (e, {ask}) => e.name == ask.init,
              callback: function () {
                this.$set('answer', 'Ожидаю, когда вы закончите печатать...')
                return new Promise(function (resolve) {
                  setTimeout(() => resolve(), 500)
                })
              }
            }
          },
          listeners: {
            questionChanged: function (e) {
              this.ask(e.data.question)
            },
            // waitAsk: function (e) {
            //   e.policy = 'exclusive'
            //   this.set('answer', 'Ожидаю, когда вы закончите печатать...')
            //   return new Promise(function (resolve) {
            //     setTimeout(() => resolve(), 500)
            //   })
            // }
          },
          methods: {
            ask: function (question) {
              this.$set('answer', 'Думаю...')
              return api.getYesNo(question)
                .then(response => {
                  this.$set('answer', _.capitalize(response.answer))
                })
                .catch(err => {
                  this.$set('answer', 'Ошибка! Не могу связаться с API. ' + err)
                })
            }
          }
        })
      },
      $example: {
        $input: {
          html: 'input',
          onChange: function (e, {data}) {
            data.$set('question', e.target.value)
          },
          dataId: 'question',
          dataChanged: Mutate.Value
//          value: Bind.data('question')
        },
        $info: {
          html: 'p',
          dataId: 'answer',
          dataChanged: Mutate.Text
//          text: Bind.data('answer')
        }
      }
    }, {
      sources: {
        data: new Domain(1, {
          properties: {
            x10: {
              calc: v => v * 10
            }
          },
          actions: {
            increment: function () {
              this.$set(this.$get()+1)
            }
          }
        })
      },
      $button: {
        as: Button,
        text: 'Increment',
        onClick: function (e, {data}) {
          data.increment()
        }
      },
      $text: {
        dataId: 'x10',
        dataChanged: Mutate.Text
//        text: Bind.data('x10')
      }
    }, {
      scope: {
        data: {
          name: 'Alice'
        }
      },
      $content: {
        dataId: 'name',
        dataChanged: Mutate.Text
        //text: Bind.data('name'),
        // aaa: $.any([$.data('name'), $.page('user')], (name, user) => 'Name' + name + ', User: ' + user.username),
        // bbb: $.any(({data, page}) => 'Name' + data.name + ', User: ' + page.user.username)
      }
    }, {
      sources: {
        delegate: new Domain({
          components: []
        }, {
          events: {
            dirty: {}
          },
          actions: {
            addComponent: function (c) {
              this.$entry('components').$add(c)
            },
            removeComponent: function (c) {
              this.$entry('components').$remove(c)
            }
          }
        })
      },
      $comp1: {
        styles: {backgroundColor: 'red', padding: '1rem'},
        onDirty: function () {
          debugger
        },
        delegateJoined: function (delegate) {
          delegate.$on('dirty', () => {
            this.rerender()
          })
        },
        renderers: {
          '*': {
            render: function () {
              const {delegate} = this.sources
              const {html, props} = this.dom
              const components = delegate.get('components').map(c => {
                // Renderable
                return {
                  render: function () {
                    return c.render('portal')
                  } 
                }
              })
              return Layout.simple(Config.Renderer.h, html, props, components)
            }
          }
        },
      },
      $comp2: {
        sources: {
          data: () => 'Hello'
        },
        $outer: {
          styles: {backgroundColor: 'blue', padding: '1rem'},
          delegateJoined: function (delegate) {
            delegate.$watch(e => e.name == 'init', () => {
              // отключаем рендерер по умолчанию и перенаправляем обновления
              this.renderers = {
                '*': {
                  update: () => {
                    this._dirty = true
                    delegate.emit('dirty')
                  },
                  render: () => {} // noop
                }              
              }
              delegate.actions.addComponent(this)
            }, this)
            delegate.$watch(e => e.name == 'destroy', () => {
              delegate.actions.removeComponent(this)
              // включаем рендеринг по умолчанию
              this.renderers = null
            })
          },
          $content: {
            html: 'input',
            dataChanged: function (v) {
              return {value: v}
            },
            onChange: function (e, {data}) {
              data.$set(e.target.value)
            }
          }  
        },
        $inner: {
          styles: {backgroundColor: 'yellow', padding: '1rem'},
          dataChanged: function (v) {
            return {text: v}
          }
        }
      }
    }]
  }
}
