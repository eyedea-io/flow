import {useStore} from '@website/hooks/use-store'
import {D3Node} from '@website/stores/node-store'
import * as d3 from 'd3'
import {useEffect} from 'react'

export const dragHandler = () => {
  const {nodeStore: {nodesCollection}} = useStore()

  return d3.drag()
    .on('drag.a', () => {
      nodesCollection.selected.map(item => {
        item.setPosition(item.x + d3.event.dx, item.y + d3.event.dy)
      })
    })
    .on('end', function (d: D3Node) {
      if (d === undefined) { return }

      nodesCollection.selected.map(item => {
        item.setPosition(item.snapX, item.snapY)
      })
    })
}

export const addDragBehavior = () => {
  const {nodeStore: {nodesCollection}} = useStore()

  useEffect(() => {
    d3.selectAll('.nodes rect')
      .attr('x', (d: D3Node) => d.snapX)
      .attr('y', (d: D3Node) => d.snapY)
  }, [
    nodesCollection.value.map(item => item.x),
    nodesCollection.value.map(item => item.y),
  ])
}
