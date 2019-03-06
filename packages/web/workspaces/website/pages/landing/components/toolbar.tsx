import {Text} from '@shared/components/text'
import {useStore} from '@website/hooks/use-store'
import * as d3 from 'd3'
import {useCallback, useEffect, useRef, useState} from 'react'
import * as React from 'react'
import {GRID} from '../constants'
import {S} from './toolbar.styled'

const SPACE = 32

export const Toolbar = ({wrapper}: {
  wrapper: React.MutableRefObject<HTMLElement>
}) => {
  const {nodeStore} = useStore()
  const toolbar = useRef(null)
  const [activeNodeType, setActiveNodeType] = useState(null)
  const [lastKeyDown, setLastKeyDown] = useState(-1)
  const [mousePosition, setMousePosition] = useState([0, 0])
  const [showToolbar, setShowToolbar] = useState(false)
  const mousemove = useCallback(function () {
    if (showToolbar === false) {
      setMousePosition(d3.mouse(this))
    }
  }, [showToolbar])
  const keydown = useCallback(function () {
    if (lastKeyDown !== -1) { return }

    setLastKeyDown(d3.event.keyCode)

    switch (d3.event.keyCode) {
      case SPACE:
        setShowToolbar(true)
        break
      default: break
    }
  }, [])

  const keyup = useCallback(() => {
    let [x, y] = mousePosition

    if (activeNodeType) {
      const zoom = d3.zoomTransform(d3.select(wrapper.current).select<SVGSVGElement>('svg').node())
      const lastNode = nodeStore.nodesCollection.last()

      x = (x - zoom.x) / zoom.k
      y = (y - zoom.y) / zoom.k

      nodeStore.nodesCollection.add({
        id: lastNode ? lastNode.id + 1 : 1,
        label: activeNodeType.name,
        width: 120,
        height: 48,
        x: x - (x % GRID),
        y: y - (y % GRID),
        nodeType: activeNodeType,
        isSelected: false,
      })
    }

    setLastKeyDown(-1)
    setActiveNodeType(null)
    setShowToolbar(false)
  }, [activeNodeType])

  useEffect(() => {
    d3.select(wrapper.current)
      .on('mousemove.toolbar', mousemove)

    d3.select(window)
      .on('keydown.toolbar', keydown)
      .on('keyup.toolbar', keyup)
  }, [keydown, mousemove, activeNodeType])

  return showToolbar && (
    <S.Toolbar ref={toolbar} style={{
      top: mousePosition[1],
      left: mousePosition[0],
    }}>
      {nodeStore.nodeTypes.map(item => (
        <S.ToolbarItem
          key={item.name}
          onMouseEnter={() => setActiveNodeType(item)}
          onMouseLeave={() => setActiveNodeType(null)}
        >
          <Text color={null}>{item.name}</Text>
        </S.ToolbarItem>
      ))}
    </S.Toolbar>
  )
}
