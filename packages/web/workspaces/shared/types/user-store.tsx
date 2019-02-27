import * as Sentry from '@sentry/browser'
import {User} from '@shared/types/user'
import {request} from '@shared/utils/request'
import {applySnapshot, flow, getRoot, types} from 'mobx-state-tree'

export const UserStore = types
  .model('UserStore', {
    token: types.optional(types.string, ''),
    profile: types.maybe(User),
  })
  .views(self => ({
    get isLoggedIn(): boolean {
      return Boolean(self.token && self.profile)
    },
  }))
  .actions(self => ({
    setToken(token: string = '') {
      self.token = token
      localStorage.setItem('token', token)
    },
  }))
  .actions(self => ({
    fetchProfile: flow(function * () {
      if (!self.token) {
        return
      }

      try {
        self.profile = yield request.post('user/profile')
        localStorage.setItem('profile', JSON.stringify(self.profile))

        Sentry.configureScope((scope) => {
          scope.setUser({
            id: self.profile.id.toString(),
            email: self.profile.username,
          })
        })
      } catch (error) {
        if (error.response.status === 401) {
          self.setToken()
        }
        throw error
      }
    }),
  }))
  .actions(self => ({
    afterCreate: flow(function * () {
      self.token = window.localStorage.getItem('token') || ''
      self.profile = JSON.parse(window.localStorage.getItem('profile')) || undefined
      self.fetchProfile()
    }),
    logout() {
      self.setToken()
      window.localStorage.clear()
      self.profile = undefined
      applySnapshot(getRoot(self), {})
    },
    login: flow(function * (credentials: {username: string, password: string}) {
      const {token} = yield request.post('user-auth/login', credentials)

      self.setToken(token)

      return self.fetchProfile()
    }),
    register: flow(function * (credentials: {username: string, password: string}) {
      const {token} = yield request.post('user-auth/register', credentials)

      self.setToken(token)

      return self.fetchProfile()
    }),
  }))

type UserStoreType = typeof UserStore.Type
export interface UserStore extends UserStoreType {}
