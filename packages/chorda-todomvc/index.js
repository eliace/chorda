//import {createProjector} from 'maquette'
import createApp from './src/app'
import {Router} from 'director/build/director'
import { Config } from '../chorda-demo-react/src/chorda/node_modules/chorda-core'
import * as ReactAdapter from '../chorda-demo-react/src/chorda/node_modules/chorda-react'

Config.use(ReactAdapter.Context)

const app = createApp()

const router = new Router({
  '/': () => {
    app.scope.view.$set('filter', 'all')
  },
  '/active': () => {
    app.scope.view.$set('filter', 'active')
  },
  '/completed': () => {
    app.scope.view.$set('filter', 'completed')
  }
})


document.addEventListener('DOMContentLoaded', function () {
  Config.Renderer.append(app, document.getElementById('app'))
})

router.init()

