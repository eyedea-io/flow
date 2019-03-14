import {observer} from 'mobx-react-lite'
import {hot} from 'react-hot-loader'
import {addDragBehavior, dragHandler} from '../behaviors/drag'
import {addSelectionBehavior} from '../behaviors/selection'
import {renderLinks} from '../renderers/links'
import {renderNodes} from '../renderers/nodes'
import {renderQuickActions} from '../renderers/quick-actions'
import {renderWorkspace} from '../renderers/workspace'

export const Workspace = hot(module)(observer(() => {
  const drag = dragHandler()

  renderWorkspace()
  renderNodes({drag})
  renderLinks()
  renderQuickActions()

  addSelectionBehavior(drag)
  addDragBehavior()

  return null
}))
