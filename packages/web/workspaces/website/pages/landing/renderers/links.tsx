import {useStore} from '@website/hooks/use-store'
import {useWorkspace} from '@website/hooks/use-workspace'
import {D3Link} from '@website/types/d3-link'
import * as d3 from 'd3'
import {useEffect} from 'react'

export const renderLinks = () => {
  const workspace = useWorkspace()
  const {nodeStore: {linksCollection}} = useStore()

  useEffect(() => {
    const connect = d3.line().curve(d3.curveStep)
    const paths = d3
      .select(workspace.current)
      .select('.links')
      .selectAll('.path')
      .data(linksCollection.paths())
    const lines = d3
      .select(workspace.current)
      .select('.links')
      .selectAll('.line')
      .data(linksCollection.lines())
    paths
      .enter()
      .append('path')
      .attr('class', 'path')
      .attr('fill', 'none')
      .attr('stroke', '#788896')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 2)
      .attr('d', (d: D3Link) => connect(d.startAndEnd()))
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
    paths
      .exit()
      .remove()
    lines
      .enter()
      .append('line')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#788896')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 2)
      .attr('x1', (d: D3Link) => d.startAndEnd()[0][0])
      .attr('y1', (d: D3Link) => d.startAndEnd()[0][1])
      .attr('x2', (d: D3Link) => d.startAndEnd()[1][0])
      .attr('y2', (d: D3Link) => d.startAndEnd()[1][1])
      .style('marker-start', (d) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d) => d.right ? 'url(#end-arrow)' : '')
    lines
      .exit()
      .remove()
  }, [
    linksCollection.value.length,
    linksCollection.value.map(item => item.isStraightLine),
  ])
}
