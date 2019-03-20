import {useStore} from '@website/hooks/use-store'
import {useWorkspace} from '@website/hooks/use-workspace'
import {D3Node} from '@website/types/d3-node'
import * as d3 from 'd3'
import {isAlive} from 'mobx-state-tree'
import {useEffect, useRef} from 'react'

interface Props {
  drag: d3.DragBehavior<SVGGElement, D3Node, D3Node>
}

export const renderNodes = ({drag}: Props) => {
  const workspace = useWorkspace()
  const canvasRef = useRef(document.createElement('canvas'))
  const contextRef = useRef(canvasRef.current.getContext('2d'))
  const {nodeStore: {nodesCollection}} = useStore()

  useEffect(() => {
    const nodes = d3
      .select(workspace.current)
      .select('.nodes')
      .selectAll<SVGGElement, D3Node>('.node')
      .data<D3Node>(nodesCollection.all(), (d) => isAlive(d) ? d.uuid : '')

    nodes
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(drag)
      .append('rect')
      .on('dblclick', (d: D3Node) => {
        nodesCollection.unselectAll()
        d.isSelected.setTrue()
      })
      .attr('fill', (d: D3Node) => d.nodeType ? d.nodeType.color : 'none')
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('width', (d: D3Node) => d.width)
      .attr('height', (d) => d.height)

    nodes
      .exit()
      .remove()

    d3
    .select(workspace.current)
    .select('.nodes')
      .selectAll<SVGTextElement, D3Node>('.node')
      .data<D3Node>(nodesCollection.all(), (d) => isAlive(d) ? d.uuid : '')
      .append<SVGTextElement>('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('xml:space', 'preserve')
      .attr('font-family', 'Arial')
      .attr('font-size', 16)
      .attr('fill', '#ffffff')
      .append('tspan')
      .attr('style', 'white-space: pre')
      .attr('text-anchor', 'middle')
      .attr('x', (d: D3Node) => d.textX)
      .attr('y', (d: D3Node) => d.textY)
      .text((d: D3Node) => d.data.get('title'))
      .exit()
      .remove()
  }, [
    nodesCollection.all().length,
  ])

  useEffect(() => {
    nodesCollection.all().forEach(item => item.calculateSize(contextRef.current))

    d3
      .select(workspace.current)
      .select('.nodes')
      .selectAll<SVGRectElement, D3Node>('.node rect')
      .attr('width', (d) => d.width)

    d3.selectAll<SVGTSpanElement, D3Node>('.node text tspan')
      .attr('x', (d) => d.textX)
      .attr('y', (d) => d.textY)
      .text((d) => isAlive(d) && d.data.get('title'))
  }, [
    nodesCollection.value.map(item => item.snapX).join(','),
    nodesCollection.value.map(item => item.snapY).join(','),
    nodesCollection.value.map(item => item.data.get('title')).join(','),
  ])
}
