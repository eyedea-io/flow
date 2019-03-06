import {GRID} from '../constants'

export const addGridPattern = (
  svg: d3.Selection<SVGElement, {}, null, undefined>
) => {
  const content = svg.select('.content')
  const grid = content
    .append('g')
    .attr('class', 'grid')
  const gridDefs = grid
    .append('svg:defs')
  gridDefs
    .append('svg:pattern')
    .attr('id', 'grid')
    .attr('width', GRID)
    .attr('height', GRID)
    .attr('patternUnits', 'userSpaceOnUse')
    .append('svg:circle')
    .attr('cx', 1)
    .attr('cy', 1)
    .attr('r', .5)
    .attr('fill', '#bcc7d1')
  const pattern2 = gridDefs
    .append('svg:pattern')
    .attr('id', 'grid2')
    .attr('width', GRID * 2)
    .attr('height', GRID * 2)
    .attr('patternUnits', 'userSpaceOnUse')
  pattern2
    .append('svg:circle')
    .attr('cx', 1)
    .attr('cy', 1)
    .attr('r', 1)
    .attr('fill', '#bcc7d1')
  pattern2
    .append('svg:rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', GRID * 2)
    .attr('height', GRID * 2)
    .attr('fill', 'url(#grid)')

  return grid
    .append('svg:rect')
    .attr('class', 'unselect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', svg.node().clientWidth)
    .attr('height', svg.node().clientHeight)
    .attr('fill', 'url(#grid2)')
    .attr('transform', 'translate(-1,-1)')
}
