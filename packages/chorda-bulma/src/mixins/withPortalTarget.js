import { Layout, Domain, Config } from 'chorda-core'
import { Collection } from '../utils'


function rerenderOnDirty (s) {
  s.$on('dirty', () => {
    this.rerender()
  })
}

export default function withPortalTarget (mixer) {
    mixer.mix({
      sources: {
        portal: () => new Domain({
          components: []
        }, {
          properties: {
            components: {
              type: Collection
            }
          }
        })
      },
      $portal: {
        styles: {
          position: 'absolute',
          zIndex: 100,
          left: 0,
          top: 0
        },
        join: {
          portal: { rerenderOnDirty }
        },
        // portalJoined: function (s) {
        //   s.$on('dirty', () => {
        //     this.rerender()
        //   }, this)
        // },
        renderers: {
          '*': {
            render: function () {
              const {html, props} = this.dom
              const components = this.sources.portal.components.$get().map(c => {
                return {
                  render: () => c.render('portal')
                }
              })
              return Layout.simple(Config.Renderer.h, html, props, components)
            }
          }
        }
      }
    })
}
    