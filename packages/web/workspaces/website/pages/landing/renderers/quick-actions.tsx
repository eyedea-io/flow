import {theme} from '@shared/theme'
import {useStore} from '@website/hooks/use-store'
import {useWorkspace} from '@website/hooks/use-workspace'
import {calculatePosition, D3Link} from '@website/types/d3-link'
import {D3Node} from '@website/types/d3-node'
import * as d3 from 'd3'
import {useEffect, useState} from 'react'

const SPACING = 18

export const renderQuickActions = () => {
  const workspace = useWorkspace()
  const {nodeStore: {nodesCollection, linksCollection}} = useStore()
  const {selection} = nodesCollection
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(nodesCollection.selected.filter(item => item.isSelected).length === 1)
  }, [nodesCollection.selected.filter(item => item.isSelected).length === 1])

  useEffect(() => {
    const drag = d3
      .drag<SVGCircleElement, {}>()
      .on('start', () => {
        const newLinkGroup = d3
          .select(workspace.current)
          .select('.content')
          .append('g')
          .attr('class', 'new-link')
        d3
          .select(workspace.current)
          .select('.quick-action')
          .attr('hidden', true)
        newLinkGroup
          .append('circle')
        // .attr('cx', selection.x + selection.width / 2)
        // .attr('cy', selection.y + selection.height + SPACING)
        newLinkGroup
          .append('path')
          .attr('fill', 'none')
          .attr('stroke', '#788896')
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 2)
          // .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      })
      .on('drag.n', () => {
        const source = d3
          .select(workspace.current)
          .select('.nodes')
          .selectAll<SVGRectElement, D3Node>('.node')
          .filter((d) => d.isSelected.value)
          .data()[0]

        if (source === null) {return}

        const connect = d3.line().curve(d3.curveStep)
        const target = D3Node.create({
          nodeType: 'Component',
          height: 0,
          width: 0,
          x: d3.event.x,
          y: d3.event.y,
        })
        const newLinkGroup = d3
          .select(workspace.current)
          .select('.new-link')

        newLinkGroup
          .select('circle')
          .attr('cx', d3.event.x)
          .attr('cy', d3.event.y)
        newLinkGroup
          .data([target])
          .select('path')
          .style('marker-end', 'url(#end-arrow)')
          .attr('d', () => connect([
            calculatePosition(source, target, 2.5),
            calculatePosition(target, source, 2.5),
          ]))
      })
      .on('end', () => {
        // Show quck action
        d3.select(workspace.current).select('.quick-action').attr('hidden', null)

        const source = d3
          .select(workspace.current)
          .select('.nodes')
          .selectAll<SVGRectElement, D3Node>('.node')
          .filter((d) => d.isSelected.value)
          .data()[0]
        const target = nodesCollection.getByCoordinates({
          x: d3.event.x,
          y: d3.event.y,
        })

        if (target !== undefined) {
          linksCollection.add(
            D3Link.create({
              source: source.uuid,
              target: target.uuid,
              right: true,
            })
          )
        }

        d3.select(workspace.current).select('.new-link').remove()
      })

    const group = d3
      .select(workspace.current)
      .select('.content')
      .append('g')
      .attr('class', 'quick-actions')
    group
      .append('circle')
      .attr('class', 'quick-action')
      .attr('fill', theme.fills.solid.blue.backgroundColor)
      .attr('r', 4)
      .attr('stroke-width', 5)
      .attr('stroke', '#fff')
      .attr('hidden', () => isVisible ? null : true)
      .call(drag)
  }, [])

  useEffect(() => {
    d3
      .select(workspace.current)
      .select('.quick-action')
      .attr('hidden', () => isVisible ? null : true)
  }, [isVisible])

  useEffect(() => {
    if (!Number.isFinite(selection.x)) { return }

    d3
      .select(workspace.current)
      .select('.quick-action')
      .attr('cx', selection.x + selection.width / 2)
      .attr('cy', selection.y + selection.height + SPACING)
  }, [selection.x, selection.y])
}
