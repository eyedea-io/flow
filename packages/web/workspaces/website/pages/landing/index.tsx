import {WorkspaceContext} from '@website/contexts/workspace'
import * as React from 'react'
import {useRef} from 'react'
import {hot} from 'react-hot-loader'
import {Details} from './components/details'
import {Shortcuts} from './components/shortcuts'
import {Toolbar} from './components/toolbar'
import {Workspace} from './components/workspace'
import S from './landing.styled'

const Landing = () => {
  const workspace = useRef(null)

  return (
    <WorkspaceContext.Provider value={workspace}>
      <S.D3Wrapper ref={workspace} />
      <Workspace />
      <Toolbar />
      <Details />
      <Shortcuts />
    </WorkspaceContext.Provider>
  )
}

export default hot(module)(Landing)
