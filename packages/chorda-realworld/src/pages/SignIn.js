import {Html, Layout, Source, Domain} from 'chorda-core'
import {Mutate} from '../utils'
import Auth from '../components/Auth'
//import {sendLogin} from '../effectors'
import * as api from '../api'

function mapErrorsToArray (errors) {
  const arr = []
  for (let i in errors) {
    arr.push(i + ' ' + errors[i].join(' '))
  }
  return arr
}

export default () => {
  return {
    as: Auth,
    scope: {
      data: {

      },
      view: () => new Domain({}, {
        properties: {
          errors: Array,
          hasErrors: {
            calc: (v) => v.errors && v.errors.length > 0
          }
        },
        actions: {
          signIn: api.sendLogin
        }
      })
    },
    joints: {
      all: function ({view, page}) {
        view.$on(view.signIn.fail, (e) => {
          const errMessage = e.data.response.data
          view.errors = mapErrorsToArray(errMessage.errors)
        })
        view.$on(view.signIn.done, (e) => {
          page.login(e.data[0].user)
        })
      }
    },
    // dataMethods: {
    //   signIn: sendLogin
    // },
//     dataEvents: function (e) {
//       if (e.name == sendLogin.done) {
//         const user = e.data.user
// //        this.domain.token.set(user.token)
//         this.domain.page.login(user)
//       }
//     },
    body: {
      viewChanged: function (v, s) {
        this.opt('components', {errorMessages: s.hasErrors})
      },
      $title: {
        text: 'Sign in'
      },
      $subtitle: {
        html: 'p',
        $content: {
          html: 'a',
          href: '/#/register'
        },
        text: 'Need an account?'
      },
      $form: {
        items: [{
          placeholder: 'Email',
          dataId: 'email'
        }, {
          placeholder: 'Password',
          type: 'password',
          dataId: 'password'
        }],
        $submit: {
          text: 'Sign in',
          onClick: function (e, {data, view}) {
            e.preventDefault()
            view.signIn(data.$get())
          }
        }
      },
      $errorMessages: {
        viewId: 'errors',
        viewChanged: function (v, s) {
          this.opt('items', s.$all())
        },
        defaultItem: {
          viewChanged: function (v) {
            this.opt('text', v)
          }
        }
      }
    }
  }
}
