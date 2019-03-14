import {useStore} from '@website/hooks/use-store'
import {D3Link} from '@website/types/d3-link'
import {D3Node} from '@website/types/d3-node'
import * as d3 from 'd3'
import {useEffect} from 'react'

export const dragHandler = () => {
  const {nodeStore: {nodesCollection}} = useStore()

  return d3.drag<SVGGElement, D3Node, D3Node>()
    .on('drag.a', () => {
      nodesCollection.selected.map(item => {
        item.setPosition(item.x + d3.event.dx, item.y + d3.event.dy)
      })
    })
    .on('end', (d) => {
      if (d === undefined) { return }

      nodesCollection.selected.map(item => {
        item.setPosition(item.snapX, item.snapY)
      })
    })
}

export const addDragBehavior = () => {
  const {nodeStore: {nodesCollection}} = useStore()

  useEffect(() => {
    const connect = d3.line().curve(d3.curveStep)

    d3.selectAll<SVGRectElement, D3Node>('.node rect')
      .attr('x', (d) => d.snapX)
      .attr('y', (d) => d.snapY)
    d3.selectAll<SVGTextElement, D3Node>('.node text')
      .attr('x', (d) => d.snapX)
      .attr('y', (d) => d.snapY)
    d3.selectAll<SVGLineElement, D3Link>('.line')
      .attr('x1', (d) => d.startAndEnd()[0][0])
      .attr('y1', (d) => d.startAndEnd()[0][1])
      .attr('x2', (d) => d.startAndEnd()[1][0])
      .attr('y2', (d) => d.startAndEnd()[1][1])
    d3.selectAll<SVGPathElement, D3Link>('.path')
      .attr('d', (d) => connect(d.startAndEnd()))
  }, [
    nodesCollection.value.map(item => item.x),
    nodesCollection.value.map(item => item.y),
  ])
}
