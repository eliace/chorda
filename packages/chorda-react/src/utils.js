import createReactClass from 'create-react-class'



export const asReactClass = (_ChordaClass) => createReactClass({
    render: function () {
        const {props} = this
        this.updating = true
        if (!this._chorda) {
//            console.log(Config.getClassDescriptor(_ChordaClass))
            this._chorda = new _ChordaClass({
                ...props,
                onDirty: () => {
//                    console.log('dirty')
                    if (!this.updating) {
                        this.setState({update: !this.state.update})
                    }
                }    
                // update: () => {
                //     console.log('update state', this.updating)
                // }
            })
        }
        else {
//            console.log('update props', props.value)
            this._chorda.opt(props)
//            Config.Renderer.render()
//            console.log('done props')
        }
        this.updating = false
        return this._chorda.render()
    },
    getInitialState: function () {
        return {update: false}
    }
})
