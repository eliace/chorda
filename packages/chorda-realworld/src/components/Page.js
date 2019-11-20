import {Html} from 'chorda-core'
import ColumnsLayout from '../layouts/Columns'


export default class Page extends Html {
  config () {
    return {
      $content: {
        css: 'container page',
        layout: ColumnsLayout,
        $content: {
          col: 'col-md-6 offset-md-3 col-xs-12',
        }
      }
    }
  }
  options () {
    return {
      body: {
        mix: function (o, mixer) {
          mixer.mix({
            $content: {
              $content: o
            }
          })
        }
      }  
    }
  }
}
