import { asReactClass } from "./utils"
import { Html } from "chorda-core"


const AutoFocus = (el) => {
    requestAnimationFrame(() => {
      el.focus()
    })
  }



class Input extends Html {
    config () {
        return {
            css: 'form-group',
            $label: {
                html: 'label'
            },
            $input: {
                css: 'form-control',
                html: 'input',
//                value: '',
                // onChange: function (e) {
                //     console.log('change')
                //     this.opt('value', e.target.value)
                // },
                dom: { AutoFocus }
            },
            // renderers: {
            //     '*': function () {
            //         console.log('render')
            //     }
            // },
        }
    }
    options () {
        return {
            text: {
                set: function (v) {
                    this.$label.opt('text', v)
                }
            },
            value: {
                set: function (v) {
                    this.$input.opt('value', v)
                }
            },
            id: {
                set: function (v) {
                    this.$input.opt('id', v)
                }
            },
            type: {
                set: function (v) {
                    this.$input.opt('type', v)
                }
            },
            label: {
                set: function (v) {
                    this.$label.opt('htmlFor', v)
                }
            },
            handleChange: {
                mix: function (v, mixer) {
                    mixer.mix({
                        $input: {
                            onChange: v
                        }
                    })
//                    this.$input.opt('onChange', v)
                }
            }
        }
    }
}

export default asReactClass(Input)




