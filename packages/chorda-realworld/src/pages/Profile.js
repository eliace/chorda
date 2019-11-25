import {Html, Layout, Source, Domain} from 'chorda-core'
import ColumnsLayout from '../layouts/Columns'
import Nav from '../elements/Nav'
import ArticleItem from '../elements/ArticleItem'
//import {getArticles} from '../effectors'
import * as api from '../api'

export default () => {
  return {
    scope: {
      view: () => new Domain({}, {
        properties: {
          tab: String,
          isLoading: Boolean,
          hasArticles: Boolean
        }
      }),
      data: () => new Domain({}, {
        properties: {
          profile: {
//            type: Object,
            initial: () => {return {}}
          },
          articles: Array,
          hasArticles: {
            calc: (v) => v.articles && v.articles.length > 0
          }
        },
        actions: {
          loadProfile: async function (username) {
            this.profile = {}
            const v = await api.getProfile(username)
            this.profile = v.profile
          },
          loadArticlesByAuthor: async function (username) {
            this.articles = []
            const v = await api.getArticlesByAuthor(username)
            this.articles = v.articles

          },
          loadFavoritedArticles: async function (username) {
            this.articles = []
          }
        }
      })
    },
//    dataId: 'profile',
    sourcesBound: function ({data, page, selection}) {

      const loadArticles = data.effect('loadArticles', this, async (type, p) => {
        data.set('articles', [])
        const v = await getArticles[type](p)
        data.set('articles', v.articles)
      })
      loadArticles.My = data.effect('loadMyArticles', this, () => {
        return loadArticles('ByAuthor', data.get('username'))
      })
      loadArticles.Favorited = data.effect('loadFavoritedArticles', this, () => {
        return loadArticles('Favorited', data.get('username'))
      })
      const selectTab = selection.effect('selectTab', this, (key) => {
        selection.set('currentTab', key)
      })

      const reloadArticles = () => {
//        selectTab(selection.get('currentTab'))
        const key = selection.get('currentTab')
        if (key == 'my') {
          loadArticles.My()
        }
        else if (key == 'favorited') {
          loadArticles.Favorited()
        }
      }

      page.computed('followBtn', this, v => !(v.user && v.username == v.user.username))
      page.computed('settingsBtn', this, v => v.user && v.username == v.user.username)

      data.watch(loadArticles.init, this, () => {
        page.set('loadingArticles', true)
        page.set('noArticles', false)
      })
      data.watch(loadArticles.done, this, () => {
        page.set('loadingArticles', false)
        page.set('noArticles', data.entry('articles').isEmpty())
      })
      data.watch(e => e.name == 'init' && e.target == this, this, reloadArticles)
      selection.watch(selectTab.done, this, reloadArticles)

      // data.watch('@loadProfile:done', this, (e) => {
      //   console.log('profile reloaded')
      // })

    },
    selectionEvents: function (e) {
      console.log('[profile] selection', e)
    },
    dataEvents: function (e) {
      console.log('[profile] data', e)
    },

    joints: {
      all: function ({data, page, view}) {

        function reloadProfile () {
          if (page.isCurrentUser) {
            data.profile = page.$at('user').$clone()
          }
          else {
            data.loadProfile(page.username)
          }
        }

        function reloadArticles () {
          data.loadArticlesByAuthor(page.username)
        }


        data.$on('init', reloadProfile)
        page.$watch('username', reloadProfile)
        data.$watch('profile', reloadArticles)
        data.$on(data.loadArticlesByAuthor.start, () => {
          view.isLoading = true
        })
        data.$on(data.loadArticlesByAuthor.done, () => {
          view.isLoading = false
        })
        data.$watch('articles', () => {
          view.hasArticles = data.articles && data.articles.length > 0
        })

        // view.createProperty('hasArticles', {
        //   calc: () => {
        //     return data.articles && data.articles.length > 0
        //   }
        // })
      }
    },

    css: 'profile-page',
    $userInfo: {
      scope: {
        data: (ctx) => ctx.data.$at('profile')
      },
      css: 'user-info',
      $content: {
        css: 'container',
        layout: ColumnsLayout,
        $content: {
          layout: Layout.passthru,
          col: 'col-xs-12 col-md-10 offset-md-1',
          $avatar: {
            html: 'img',
            css: 'user-img',
            dataChanged: function (v) {
              this.opt('src', v.image)
            }
          },
          $name: {
            html: 'h4',
            dataChanged: function (v) {
              this.opt('text', v.username)
            }
          },
          $bio: {
            html: 'p',
            dataChanged: function (v) {
              this.opt('text', v.bio)
            }
          },
          $followBtn: {
            html: 'button',
            css: 'btn btn-sm btn-outline-secondary action-btn',
            $icon: {
              html: 'i',
              css: 'ion-plus-round'
            },
            dataChanged: function (v) {
              this.opt('text', ' Follow ' + v.username)
            }
          },
          $settingsBtn: {
            html: 'a',
            css: 'btn btn-sm btn-outline-secondary action-btn',
            $icon: {
              html: 'i',
              css: 'ion-gear-a'
            },
            text: ' Edit profile settings',
            href: '/#/settings'
          },
          components: {
            followBtn: false,
            settingsBtn: false
          },
          pageChanged: function (v, s) {
            this.opt('components', {
              followBtn: !s.isCurrentUser,
              settingsBtn: s.isCurrentUser
            })
          }
        }
      }
    },
    $content: {
      css: 'container',
      layout: ColumnsLayout,
      $content: {
        col: 'col-xs-12 col-md-10 offset-md-1',
        $articlesToggle: {
          css: 'articles-toggle',
          $nav: {
            as: Nav,
            css: 'nav-pills outline-active',
            defaultItem: {
              viewChanged: function (v) {
                this.opt('active', v.tab == this.opt('key'))
              },
              onClick: function (e, {view}) {
                e.preventDefault()
                view.selectTab(this.opt('key'))
              }
            },
            items: [{
              text: 'My Articles',
              key: 'my'
            }, {
              text: 'Favorited Articles',
              key: 'favorited'
            }]
          }
        },
        defaultItem: {
          as: ArticleItem
        },
        dataId: 'articles',
        dataChanged: function (v, s) {
          this.opt('items', s.$all())
        },
        pageChanged: function (v, s) {
          this.opt('components', s.$snapshot())
        },
        viewChanged: function (v, s) {
          this.opt('components', {
            loadingArticles: s.isLoading,
            noArticles: !s.isLoading && !s.hasArticles
          })
        },
        $loadingArticles: {
          css: 'article-preview',
          html: 'div',
          text: 'Loading...'
        },
        $noArticles: {
          css: 'article-preview',
          html: 'div',
          text: 'No articles are here... yet.'
        },
        components: {
          articlesToggle: true,
          loadingArticles: false,
          noArticles: false
        }
      }
    }
  }
}
