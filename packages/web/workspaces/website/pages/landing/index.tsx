import {observer} from 'mobx-react-lite'
import * as React from 'react'
import {useRef} from 'react'
import {hot} from 'react-hot-loader'
import {Toolbar} from './components/toolbar'
import {Workspace} from './components/workspace'
import S from './landing.styled'

const Landing = () => {
  const wrapper = useRef(null)

  return (
    <div>
      <S.D3Wrapper ref={wrapper} />
      <Workspace wrapper={wrapper} />
      <Toolbar wrapper={wrapper} />
    </div>
  )
}

export default hot(module)(observer(Landing))
