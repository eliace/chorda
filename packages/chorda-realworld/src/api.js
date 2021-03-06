import axios from 'axios'

export function getAllArticles () {
  return axios.get('https://conduit.productionready.io/api/articles')
    .then(response => response.data)
}

export function getTags () {
  return axios.get('https://conduit.productionready.io/api/tags')
    .then(response => response.data)
}

export function getArticlesByTag (tag) {
  return axios.get('https://conduit.productionready.io/api/articles?tag='+tag)
    .then(response => response.data)
}

export function getArticlesByAuthor (author) {
  return axios.get('https://conduit.productionready.io/api/articles?author='+author)
    .then(response => response.data)
}

export function getUser (token) {
  return axios.get('https://conduit.productionready.io/api/user', {headers: {Authorization: 'Token '+token}})
    .then(response => response.data)
}

export function getComments (slug) {
  return axios.get('https://conduit.productionready.io/api/articles/'+slug+'/comments')
    .then(response => response.data)
}

export function getArticle (slug) {
  return axios.get('https://conduit.productionready.io/api/articles/'+slug)
    .then(response => response.data)
}

export function sendRegister (data) {
  return axios.post('https://conduit.productionready.io/api/users', {user: data})
    .then(response => response.data, err => {throw err.response.data})
}

export function sendLogin (user) {
  return axios.post('https://conduit.productionready.io/api/users/login', {user})
    .then(response => response.data)
}

export function getProfile (username) {
  return axios.get('https://conduit.productionready.io/api/profiles/'+username)
    .then(response => response.data)
}