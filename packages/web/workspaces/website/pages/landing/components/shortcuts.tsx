import {useKeyPress} from '@website/hooks/use-key-press'
import {useStore} from '@website/hooks/use-store'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {hot} from 'react-hot-loader'

export const Shortcuts = hot(module)(observer(() => {
  const {nodeStore: {nodesCollection}} = useStore()
  const isDeletePressed = useKeyPress('Delete')
  const isEscPressed = useKeyPress('Escape')

  useEffect(() => {
    if (isDeletePressed) {
      nodesCollection.removeSelected()
    }
  }, [isDeletePressed])

  useEffect(() => {
    if (isEscPressed) {
      nodesCollection.unselectAll()
    }
  }, [isEscPressed])

  return null
}))
