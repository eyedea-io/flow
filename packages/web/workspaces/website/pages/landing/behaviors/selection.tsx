import {useStore} from '@website/hooks/use-store'
import {D3Node} from '@website/stores/node-store'
import * as d3 from 'd3'
import {useEffect} from 'react'

export const addSelectionBehavior = (
  drag: d3.DragBehavior<Element, {}, {} | d3.SubjectPosition>
) => {
  const {nodeStore: {nodesCollection}} = useStore()

  drag
    .on('start', function (d: D3Node) {
      if (d === undefined) { return }

      const shiftIsPressed = d3.event.sourceEvent.shiftKey

      if (shiftIsPressed) {
        d.isSelected.toggle()
      } else if (!d.isSelected.value) {
        nodesCollection.unselectAll()
        d.isSelected.setTrue()
      }
    })

  useEffect(() => {
    const {selection} = nodesCollection

    if (nodesCollection.hasSelection) {
      d3
        .select('.selection')
        .attr('stroke', 'rgb(180, 113, 234)')
        .attr('stroke-opacity', '0.5')
        .attr('fill', 'transparent')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 2)
        .attr('x', selection.x)
        .attr('y', selection.y)
        .attr('width', selection.width)
        .attr('height', selection.height)
        .call(drag)
    } else {
      d3
        .select('.selection')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', 0)
    }
  }, [
    nodesCollection.hasSelection,
    nodesCollection.selected.map(item => item.snapX),
    nodesCollection.selected.map(item => item.snapY),
  ])
}
