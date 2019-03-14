import {Router} from '@reach/router'
import {loadable} from '@shared/utils/loadable'
import '@shared/utils/normalize'
import {ROUTER_BASEPATH} from '@website/config'
import '@website/styles'
import * as React from 'react'

const routes = getRoutes()

export const Routes = () => (
  <Router basepath={ROUTER_BASEPATH}>
    <routes.Index path="/" />
    <routes.Auth.Login path="/auth/login" />
    <routes.Auth.Register path="/auth/register" />
    <routes.Auth.Logout path="/auth/logout" />
    <routes.Missing default />
  </Router>
)

function getRoutes() {
  return {
    Index:  loadable(() => import('@website/pages/landing')),
    Missing: loadable(() => import('@website/pages/missing')),
    Auth: {
      Login:  loadable(() => import('@website/pages/auth/login')),
      Logout: loadable(() => import('@website/pages/auth/logout')),
      Register: loadable(() => import('./pages/auth/register')),
    },
  }
}
