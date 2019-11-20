import { Button, Buttons } from 'chorda-bulma'

export default () => {
    return {
        as: Buttons,
        defaultItem: {
          as: Button,
        },
        items: [
          {icon: 'fa-bold'},
          {icon: 'fa-italic'},
          {icon: 'fa-underline'},
        ]  
    }
}