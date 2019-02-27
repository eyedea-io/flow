import styled from '@shared/utils/styled'
import {useStore} from '@website/hooks/use-store'
import * as d3 from 'd3'
import {SimulationLinkDatum, SimulationNodeDatum} from 'd3'
import * as React from 'react'
import {useEffect} from 'react'
import {hot} from 'react-hot-loader'

const D3Wrapper = styled.div`
  svg {
    background-color: #FFF;
    cursor: default;
    user-select: none;
  }

  svg:not(.active):not(.ctrl) {
    cursor: crosshair;
  }

  path.link {
    fill: none;
    stroke: #000;
    stroke-width: 4px;
    cursor: default;
  }

  svg:not(.active):not(.ctrl) path.link {
    cursor: pointer;
  }

  path.link.selected {
    stroke-dasharray: 10,2;
  }

  path.link.dragline {
    pointer-events: none;
  }

  path.link.hidden {
    stroke-width: 0;
  }

  circle.node {
    stroke-width: 1.5px;
    cursor: pointer;
  }

  circle.node.reflexive {
    stroke: #000 !important;
    stroke-width: 2.5px;
  }

  text {
    font: 12px sans-serif;
    pointer-events: none;
  }

  text.id {
    text-anchor: middle;
    font-weight: bold;
  }
`

interface GraphNode extends SimulationNodeDatum {
  id: number
  reflexive: boolean
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  left: boolean
  right: boolean
  source: GraphNode
  target: GraphNode
}

const Landing = () => {
  const svgRef = React.useRef(null)
  const width = 960
  const height = 500
  const colors = d3.scaleOrdinal(d3.schemeCategory10)
  const {} = useStore()
  let svg = null
  let force = null

  const nodes: GraphNode[] = [
    {id: 0, reflexive: false},
    {id: 1, reflexive: true},
    {id: 2, reflexive: false},
  ]
  // const lastNodeId = 2
  const links: GraphLink[] = [
    {source: nodes[0], target: nodes[1], left: false, right: true},
    {source: nodes[1], target: nodes[2], left: false, right: true},
  ]

  // line displayed when dragging new nodes
  let dragLine = null

  // handles to link and node element groups
  let path = null
  let circle = null

  // mouse event vars
  let selectedNode = null
  let selectedLink = null
  let mousedownLink = null
  let mousedownNode = null
  let mouseupNode = null

  useEffect(() => {
    if (svgRef.current) {
      svg = d3.select(svgRef.current)
      path = svg.append('svg:g').selectAll('path')
      circle = svg.append('svg:g').selectAll('g')
      dragLine = svg.append('svg:path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0')
    }
  }, [svgRef.current])

  useEffect(() => {
    force = d3.forceSimulation()
      .force('link', d3.forceLink<any, SimulationLinkDatum<GraphNode>>().id((d) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .on('tick', tick)

    // init D3 drag support
    // const drag = d3.drag<Element, any>()
    //   .on('start', (d) => {
    //     if (!d3.event.active) {
    //       force.alphaTarget(0.3).restart()
    //     }

    //     d.fx = d.x
    //     d.fy = d.y
    //   })
    //   .on('drag', (d) => {
    //     d.fx = d3.event.x
    //     d.fy = d3.event.y
    //   })
    //   .on('end', (d) => {
    //     if (!d3.event.active) { force.alphaTarget(0) }

    //     d.fx = null
    //     d.fy = null
    //   })
  }, [])

  useEffect(() => {
    if (svg !== undefined) {
      svg
        .append('svg:defs')
        .append('svg:marker')
          .attr('id', 'end-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 6)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
        .append('svg:path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', '#000')

      svg
        .append('svg:defs')
        .append('svg:marker')
          .attr('id', 'start-arrow')
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 4)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
        .append('svg:path')
          .attr('d', 'M10,-5L0,0L10,5')
          .attr('fill', '#000')

      // update graph (called when needed)
      restart()
    }
  }, [svg])

  function resetMouseVars() {
    mousedownNode = null
    mouseupNode = null
    mousedownLink = null
  }

  // update force layout (called automatically each iteration)
  function tick() {
    // draw directed edges with proper padding from node centers
    path.attr('d', (d: GraphLink) => {
      const deltaX = d.target.x - d.source.x
      const deltaY = d.target.y - d.source.y
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const normX = deltaX / dist
      const normY = deltaY / dist
      const sourcePadding = d.left ? 17 : 12
      const targetPadding = d.right ? 17 : 12
      const sourceX = d.source.x + (sourcePadding * normX)
      const sourceY = d.source.y + (sourcePadding * normY)
      const targetX = d.target.x - (targetPadding * normX)
      const targetY = d.target.y - (targetPadding * normY)

      return `M${sourceX},${sourceY}L${targetX},${targetY}`
    })

    circle.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
  }

  function restart() {
    // path (link) group
    path = path.data(links)

    // update existing links
    path.classed('selected', (d: GraphLink) => d === selectedLink)
      .style('marker-start', (d: GraphLink) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d: GraphLink) => d.right ? 'url(#end-arrow)' : '')

    // remove old links
    path.exit().remove()

    // add new links
    path = path.enter().append('svg:path')
      .attr('class', 'link')
      .classed('selected', (d: GraphLink) => d === selectedLink)
      .style('marker-start', (d: GraphLink) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d: GraphLink) => d.right ? 'url(#end-arrow)' : '')
      .on('mousedown', (d: GraphLink) => {
        if (d3.event.ctrlKey) { return }

        // select link
        mousedownLink = d
        selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink
        selectedNode = null
        restart()
      })
      .merge(path)

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    circle = circle.data(nodes, (d: GraphNode) => d.id)

    // update existing nodes (reflexive & selected visual states)
    circle.selectAll('circle')
      .style('fill',
        (d: GraphNode) => (d === selectedNode)
          ? d3.rgb(colors(String(d.id))).brighter().toString()
          : colors(String(d.id))
      )
      .classed('reflexive', (d: GraphNode) => d.reflexive)

    // remove old nodes
    circle.exit().remove()

    // add new nodes
    const g = circle.enter().append('svg:g')

    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill',
        (d: GraphNode) => (d === selectedNode)
          ? d3.rgb(colors(d.id.toString())).brighter().toString()
          : colors(d.id.toString())
      )
      .style('stroke',
        (d: GraphNode) => d3.rgb(colors(d.id.toString())).darker().toString())
      .classed('reflexive', (d: GraphNode) => d.reflexive)
      .on('mouseover', function (d: GraphNode) {
        if (!mousedownNode || d === mousedownNode) { return }
        // enlarge target node
        d3.select(this).attr('transform', 'scale(1.1)')
      })
      .on('mouseout', function (d: GraphNode) {
        if (!mousedownNode || d === mousedownNode) { return }
        // unenlarge target node
        d3.select(this).attr('transform', '')
      })
      .on('mousedown', (d: GraphLink) => {
        if (d3.event.ctrlKey) { return }

        // select node
        mousedownNode = d
        selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode
        selectedLink = null

        // reposition drag line
        dragLine
          .style('marker-end', 'url(#end-arrow)')
          .classed('hidden', false)
          .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`)

        restart()
      })
      .on('mouseup', function (d: GraphNode) {
        if (!mousedownNode) { return }

        // needed by FF
        dragLine
          .classed('hidden', true)
          .style('marker-end', '')

        // check for drag-to-self
        mouseupNode = d
        if (mouseupNode === mousedownNode) {
          resetMouseVars()

          return
        }

        // unenlarge target node
        d3.select(this).attr('transform', '')

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        const isRight = mousedownNode.id < mouseupNode.id
        const source = isRight ? mousedownNode : mouseupNode
        const target = isRight ? mouseupNode : mousedownNode

        const link = links.filter((l) => l.source === source && l.target === target)[0]
        if (link) {
          link[isRight ? 'right' : 'left'] = true
        } else {
          links.push({source, target, left: !isRight, right: isRight})
        }

        // select new link
        selectedLink = link
        selectedNode = null
        restart()
      })

    // show node IDs
    g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d: GraphNode) => d.id)

    circle = g.merge(circle)

    // set the graph in motion
    force
      .nodes(nodes)
      .force('link')
      .links(links)

    force.alphaTarget(0.3).restart()
  }

  return (
    <D3Wrapper>
      <svg ref={svgRef} width={width} height={height} onContextMenu={() => false} />
    </D3Wrapper>
  )
}

export default hot(module)(Landing)
