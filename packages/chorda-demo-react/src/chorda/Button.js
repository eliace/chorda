//import { asReactClass } from "./utils"
import { Html } from "chorda-core"
import { asReactClass } from "chorda-react"


class Button extends Html {
    config () {
        return {
            html: 'button',
            css: 'btn'
        }
    }
}


export default asReactClass(Button)