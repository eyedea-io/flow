import {Text} from '@shared/components/text'
import {GRID} from '@website/constants'
import {useStore} from '@website/hooks/use-store'
import {useWorkspace} from '@website/hooks/use-workspace'
import {D3Node} from '@website/types/d3-node'
import {NodeType} from '@website/types/node-type'
import * as d3 from 'd3'
import {observer} from 'mobx-react-lite'
import * as React from 'react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {hot} from 'react-hot-loader'
import {v4} from 'uuid'
import S from './toolbar.styled'

const SPACE = 32

export const Toolbar = hot(module)(observer(() => {
  const workspace = useWorkspace()
  const {nodeStore} = useStore()
  const toolbar = useRef(null)
  const [activeNodeType, setActiveNodeType] = useState<NodeType | undefined>(undefined)
  const [mousePosition, setMousePosition] = useState([0, 0])
  const [showToolbar, setShowToolbar] = useState(false)
  const mousemove = useCallback(function (this: typeof mousemove) {
    if (showToolbar === false) {
      setMousePosition(d3.mouse(this))
    }
  }, [showToolbar])
  const keydown = useCallback(() => {
    if (d3.event.target.tagName.toLowerCase() === 'input') {
      return
    }

    switch (d3.event.keyCode) {
      case SPACE:
        setShowToolbar(true)
        break
      default: break
    }
  }, [])

  const keyup = useCallback(() => {
    let [x, y] = mousePosition
    const canvas = d3.select(workspace.current).select<SVGSVGElement>('svg').node()

    if (activeNodeType && canvas !== null) {
      const zoom = d3.zoomTransform(canvas)

      x = (x - zoom.x) / zoom.k
      y = (y - zoom.y) / zoom.k
      nodeStore.nodesCollection.unselectAll()
      nodeStore.nodesCollection.add(
        D3Node.create({
          uuid: v4(),
          width: GRID * 3,
          height: GRID * 2,
          x: x - (x % GRID),
          y: y - (y % GRID),
          nodeType: activeNodeType.name,
          isSelected: true,
        })
      )
    }

    setActiveNodeType(undefined)
    setShowToolbar(false)
  }, [activeNodeType])

  useEffect(() => {
    d3.select(workspace.current)
      .on('mousemove.toolbar', mousemove)

    d3.select(window)
      .on('keydown.toolbar', keydown)
      .on('keyup.toolbar', keyup)
  }, [keydown, mousemove, activeNodeType])

  if (!showToolbar) {
    return null
  }

  return (
    <S.Toolbar ref={toolbar} style={{
      top: mousePosition[1],
      left: mousePosition[0],
    }}>
      {nodeStore.nodeTypes.map(item => (
        <S.ToolbarItem
          key={item.name}
          onMouseEnter={() => setActiveNodeType(item)}
          onMouseLeave={() => setActiveNodeType(undefined)}
        >
          <Text>{item.name}</Text>
        </S.ToolbarItem>
      ))}
    </S.Toolbar>
  )
}))
