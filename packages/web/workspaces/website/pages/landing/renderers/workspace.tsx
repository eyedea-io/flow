import {useStore} from '@website/hooks/use-store'
import {useWorkspace} from '@website/hooks/use-workspace'
import * as d3 from 'd3'
import {useEffect} from 'react'
import {zoomHandler} from '../behaviors/zoom-and-panning'
import {addGridPattern} from '../hooks/add-grid-pattern'

export const renderWorkspace = () => {
  const workspace = useWorkspace()
  const addZoomAndPanningBehavior = zoomHandler(workspace)
  const {nodeStore: {nodesCollection}} = useStore()

  useEffect(() => {
    const svg = d3
      .select(workspace.current)
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

    addGridPattern(svg)
    addZoomAndPanningBehavior(svg)

    content.append('rect').attr('class', 'selection')
    content.append('g').attr('class', 'links')
    content.append('g').attr('class', 'nodes')
    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'end-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 6)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
      .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#788896')
    svg.append('svg:defs').append('svg:marker')
        .attr('id', 'start-arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
      .append('svg:path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', '#788896')
  }, [])
}
