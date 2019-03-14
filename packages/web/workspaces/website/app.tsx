import {SentryErrorBoundary} from '@shared/components/sentry-error-boundary'
import {createStore} from '@shared/utils/create-store'
import {initSentry} from '@shared/utils/init-sentry'
import {NormalizeCSS} from '@shared/utils/normalize'
import {ThemeProvider} from '@shared/utils/styled'
import {UI} from '@website/config'
import {Store} from '@website/stores'
import '@website/styles'
import {GlobalCSS} from '@website/styles'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import {StoreContext} from './contexts/store'
import {Routes} from './routes'

class App extends React.Component {
  componentDidMount() {
    initSentry()
  }

  render() {
    return (
      <SentryErrorBoundary>
        <StoreContext.Provider value={createStore(Store)}>
          <ThemeProvider theme={UI}>
            <React.Fragment>
              <Routes />
              <NormalizeCSS />
              <GlobalCSS />
            </React.Fragment>
          </ThemeProvider>
        </StoreContext.Provider>
      </SentryErrorBoundary>
    )
  }
}

export default hot(module)(App)
