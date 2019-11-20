import {Html, Layout, Source, Domain} from 'chorda-core'
import {Mutate} from '../utils'
import ColumnsLayout from '../layouts/Columns'
import Field from '../elements/Field'
import Auth from '../components/Auth'
import * as api from '../api'
//import {sendRegister} from '../effectors'

export default () => {
  return {
    as: Auth,
    scope: {
      data: {},
      view: () => new Domain({}, {
        properties: {
          errorMessages: Array,
          hasErrors: {
            calc: (v) => v.errorMessages && v.errorMessages.length > 0
          }
        },
        actions: {
          signUp: function (v) {
            return api.sendRegister(v)
          }
        }
      }),
      router: (ctx) => ctx.router
    },
    joints: {
      init: function ({view, router}) {
        view.$on(view.signUp.fail, (evt) => {
          const errors = []
          for (let i in evt.data.errors) {
            const field = evt.data.errors[i]
            field.forEach(err => {
              errors.push(i + ' ' + err)
            })
          }
          console.log('errors', evt.data)
          view.errorMessages = errors
        })
        view.$on(view.signUp.done, () => {
          router.toProfile()
        })
      }
    },
    // dataMethods: {
    //   signUp: sendRegister
    // },
    // dataEvents: function (evt) {
    //   if (evt.name == sendRegister.fail) {
    //     const errors = []
    //     for (let i in evt.data.errors) {
    //       const field = evt.data.errors[i]
    //       field.forEach(err => {
    //         errors.push(i + ' ' + err)
    //       })
    //     }
    //     console.log(evt.data)
    //     this.domain.page.set('errorMessages', errors)
    //   }
    //   else if (evt.name == sendRegister.done) {
    //     this.domain.router.toProfile()
    //   }
    // },
    body: {
      viewChanged: function (v, s) {
        this.opt('components', {errorMessages: s.hasErrors})
      },
      $title: {
        text: 'Sign up'
      },
      $subtitle: {
        html: 'p',
        $content: {
          html: 'a',
          href: '/#/login'
        },
        text: 'Have an account?'
      },
      $errorMessages: {
        viewId: 'errorMessages',
        viewChanged: function (v, s) {
          this.opt('items', s.$all())
        },
        defaultItem: {
          viewChanged: function (v) {
            this.opt('text', v)
          }
        }
      },
      $form: {
        items: [{
          placeholder: 'Your Name',
          dataId: 'username'
        }, {
          placeholder: 'Email',
          dataId: 'email'
        }, {
          placeholder: 'Password',
          type: 'password',
          dataId: 'password'
        }],
        $submit: {
          text: 'Sign up',
          onClick: function (e, {data, view}) {
            e.preventDefault()
//            console.log(this.domain.data.get())
            view.signUp(data.$get())
          }
        }
      }
    }
  }
}


// "user": {
//     "id": 59456,
//     "email": "ufhfjfhf@fhggj.hg",
//     "createdAt": "2019-06-29T17:30:34.065Z",
//     "updatedAt": "2019-06-29T17:30:34.071Z",
//     "username": "hood",
//     "bio": null,
//     "image": null,
//     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTk0NTYsInVzZXJuYW1lIjoiaG9vZCIsImV4cCI6MTU2NzAxMzQzNH0.QWJXNOEs9ayeadIbENV22Y91GMgdGk9wS6jbKgCVW9w"
// }
