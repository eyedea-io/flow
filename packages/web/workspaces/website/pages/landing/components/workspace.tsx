import {useStore} from '@website/hooks/use-store'
import {D3Node} from '@website/stores/node-store'
import * as d3 from 'd3'
import {observer} from 'mobx-react-lite'
import * as React from 'react'
import {useEffect} from 'react'
import {addDragBehavior, dragHandler} from '../behaviors/drag'
import {addSelectionBehavior} from '../behaviors/selection'
import {addZoomAndPanningBehavior} from '../behaviors/zoom-and-panning'
import {addGridPattern} from '../hooks/add-grid-pattern'

export const Workspace = observer(({wrapper}: {
  wrapper: React.MutableRefObject<HTMLElement>
}) => {
  const drag = dragHandler()
  const {nodeStore} = useStore()
  const {nodesCollection} = nodeStore

  useEffect(() => {
    const svg = d3
      .select(wrapper.current)
      .append('svg')
      .attr('oncontextmenu', 'return false;')
      .attr('width', '100%')
      .attr('height', '100%')
      .on('click', () => {
        if (d3.event.target.classList.contains('unselect')) {
          nodesCollection.unselectAll()
        }
      })
    const content = svg
      .append('g').attr('class', 'transform')
      .append('g').attr('class', 'scale')
      .append('g').attr('class', 'content')

    addZoomAndPanningBehavior(wrapper)(svg)
    addGridPattern(svg)

    content.append('rect').attr('class', 'selection')
    content.append('g').attr('class', 'nodes')
    content.append('g').attr('class', 'links')
  }, [])

  // Render nodes
  useEffect(() => {
    d3
      .select(wrapper.current)
      .select('.nodes')
      .selectAll('rect')
      .data(nodesCollection.value, (d: any) => d.id)
      .enter()
      .append('rect')
      .attr('fill', (d: D3Node) => d.nodeType.color)
      .attr('x', (d: D3Node) => d.snapX)
      .attr('y', (d: D3Node) => d.snapY)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('width', (d) => d.width)
      .attr('height', (d) => d.height)
      .text((d: D3Node) => d.nodeType.name)
      .call(drag)
      .on('dblclick', (d: D3Node) => {
        nodesCollection.unselectAll()
        d.isSelected.setTrue()
      })
      .exit()
      .remove()
  }, [
    nodesCollection.value.length,
  ])

  addSelectionBehavior(drag)
  addDragBehavior()

  return null
})
