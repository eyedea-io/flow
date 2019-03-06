// import {useStore} from '@website/hooks/use-store'
// import {D3Link, D3Node} from '@website/stores/node-store'
// import * as d3 from 'd3'
// import {SimulationLinkDatum, SimulationNodeDatum} from 'd3'
// import {observer} from 'mobx-react-lite'
// import * as React from 'react'
// import {useCallback, useEffect} from 'react'
// import {hot} from 'react-hot-loader'
// import {useToolbar} from './hooks/use-toolbar'
// import S from './landing.styled'

// interface GraphNode extends SimulationNodeDatum, D3Node {}

// const Landing = () => {
//   const colors = d3.scaleOrdinal(d3.schemeCategory10)
//   const svgRef = React.useRef<SVGSVGElement>(null)
//   const width = '100%'
//   const height = '100%'
//   const {
//     nodeStore: {
//       nodesCollection,
//       linksCollection,
//     },
//   } = useStore()

//   let svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any> = null
//   let force = null

//   // line displayed when dragging new nodes
//   let dragLine = null

//   // handles to link and node element groups
//   let path = null
//   let group: d3.Selection<d3.BaseType, {}, d3.BaseType, {}> = null

//   // mouse event vars
//   let selectedNode: D3Node = null
//   let selectedLink: D3Link = null
//   let mousedownLink = null
//   let mousedownNode = null
//   let mouseupNode = null

//   useEffect(() => {
//     svg = d3.select<SVGSVGElement, {}>(svgRef.current)
//     path = svg.append('svg:g').selectAll('path')
//     group = svg.append('svg:g').selectAll('g')
//     dragLine = svg.append('svg:path')
//       .attr('class', 'link dragline hidden')
//       .attr('d', 'M0,0L0,0')
//     svg
//       .append('svg:defs')
//       .append('svg:marker')
//         .attr('id', 'end-arrow')
//         .attr('viewBox', '0 -5 10 10')
//         .attr('refX', 6)
//         .attr('markerWidth', 3)
//         .attr('markerHeight', 3)
//         .attr('orient', 'auto')
//       .append('svg:path')
//         .attr('d', 'M0,-5L10,0L0,5')
//         .attr('fill', '#000')

//     svg
//       .append('svg:defs')
//       .append('svg:marker')
//         .attr('id', 'start-arrow')
//         .attr('viewBox', '0 -5 10 10')
//         .attr('refX', 4)
//         .attr('markerWidth', 3)
//         .attr('markerHeight', 3)
//         .attr('orient', 'auto')
//       .append('svg:path')
//         .attr('d', 'M10,-5L0,0L10,5')
//         .attr('fill', '#000')

//     svg.on('mousedown', mousedown)
//       .on('mousemove', mousemove)
//       .on('mouseup', mouseup)
//       .call(d3.zoom().on('zoom', () => {
//         // svg.attr('transform', d3.event.transform)
//       }))
//   }, [])

//   useEffect(() => {
//     force = d3.forceSimulation()
//       .force('link', d3.forceLink<any, SimulationLinkDatum<GraphNode>>().id((d) => d.id).distance(100))
//       .force('charge', d3.forceManyBody().strength(-500))
//       .force('x', d3.forceX(document.body.clientWidth / 2))
//       .force('y', d3.forceY(document.body.clientHeight / 2))
//       .on('tick', tick)

//   }, [])

//   useEffect(() => {
//     redraw()
//   }, [svgRef.current])

//   function resetMouseVars() {
//     mousedownNode = null
//     mouseupNode = null
//     mousedownLink = null
//   }

//   // update force layout (called automatically each iteration)
//   const tick = useCallback(() => {
//     // draw directed edges with proper padding from node centers
//     path.attr('d', (d: any) => {
//       const deltaX = d.target.x - d.source.x
//       const deltaY = d.target.y - d.source.y
//       const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
//       const normX = deltaX / dist
//       const normY = deltaY / dist
//       const sourcePadding = d.left ? 17 : 12
//       const targetPadding = d.right ? 17 : 12
//       const sourceX = d.source.x + (sourcePadding * normX)
//       const sourceY = d.source.y + (sourcePadding * normY)
//       const targetX = d.target.x - (targetPadding * normX)
//       const targetY = d.target.y - (targetPadding * normY)

//       return `M${sourceX},${sourceY}L${targetX},${targetY}`
//     })

//     group.attr('transform', (d: any) => `translate(${Math.round(d.x)},${Math.round(d.y)})`)
//   }, [])

//   const redraw = useCallback(() => {
//     // path (link) group
//     path = path.data(linksCollection.value)
//     // update existing links
//     path.classed('selected', (d: D3Link) => d === selectedLink)
//       .style('marker-start', (d: D3Link) => d.left ? 'url(#start-arrow)' : '')
//       .style('marker-end', (d: D3Link) => d.right ? 'url(#end-arrow)' : '')

//     // remove old links
//     path.exit().remove()

//     // add new links
//     path = path.enter().append('svg:path')
//       .attr('class', 'link')
//       .classed('selected', (d: D3Link) => d === selectedLink)
//       .style('marker-start', (d: D3Link) => d.left ? 'url(#start-arrow)' : '')
//       .style('marker-end', (d: D3Link) => d.right ? 'url(#end-arrow)' : '')
//       .on('mousedown', (d: D3Link) => {
//         if (d3.event.ctrlKey) { return }

//         // select link
//         mousedownLink = d
//         selectedLink = (mousedownLink === selectedLink) ? null : mousedownLink
//         selectedNode = null
//         redraw()
//       })
//       .merge(path)

//     // group (node) group
//     // NB: the function arg is crucial here! nodes are known by id, not by index!
//     group = group.data(nodesCollection.value, (d: any) => d.id)

//     // update existing nodes (reflexive & selected visual states)
//     // group.selectAll('circle')
//     //   .style('fill',
//     //     (d: GraphNode) => (d === selectedNode)
//     //       ? d3.rgb(colors(String(d.id))).brighter().toString()
//     //       // : colors(String(d.id))
//     //       : '#fff'
//     //   )
//     //   .classed('reflexive', (d: GraphNode) => d.reflexive)

//     // remove old nodes
//     group.exit().remove()

//     // add new nodes
//     const g = group.enter().append('svg:g')

//     g.append('svg:circle')
//       .attr('class', 'node')
//       .attr('r', 12)
//       .style('fill',
//         (d: GraphNode) => (d === selectedNode)
//           ? d3.rgb(colors(d.id.toString())).brighter().toString()
//           // : colors(d.id.toString())
//           : '#fff'
//       )
//       .style('stroke',
//         (d: GraphNode) => d3.rgb(colors(d.id.toString())).darker().toString())
//       .classed('reflexive', (d: GraphNode) => d.reflexive)
//       .on('mouseover', function (d: GraphNode) {
//         // if (!mousedownNode || d === mousedownNode) { return }
//         // enlarge target node
//         d3.select(this).attr('transform', 'scale(1.1)')
//       })
//       .on('mouseout', function (d: GraphNode) {
//         // if (!mousedownNode || d === mousedownNode) { return }
//         // unenlarge target node
//         d3.select(this).attr('transform', '')
//       })
//       .on('mousedown', (d: D3Link) => {
//         if (d3.event.ctrlKey) { return }

//         // select node
//         mousedownNode = d
//         selectedNode = (mousedownNode === selectedNode) ? null : mousedownNode
//         selectedLink = null

//         // reposition drag line
//         dragLine
//           .style('marker-end', 'url(#end-arrow)')
//           .classed('hidden', false)
//           .attr('d', `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`)

//         redraw()
//       })
//       .on('mouseup', function (d: GraphNode) {
//         if (!mousedownNode) { return }

//         // needed by FF
//         dragLine
//           .classed('hidden', true)
//           .style('marker-end', '')

//         // check for drag-to-self
//         mouseupNode = d
//         if (mouseupNode === mousedownNode) {
//           resetMouseVars()

//           return
//         }

//         // unenlarge target node
//         d3.select(this).attr('transform', '')

//         // add link to graph (update if exists)
//         // NB: links are strictly source < target; arrows separately specified by booleans
//         const isRight = mousedownNode.id < mouseupNode.id
//         const source = isRight ? mousedownNode : mouseupNode
//         const target = isRight ? mouseupNode : mousedownNode

//         const link = linksCollection.value.filter((l) => l.source === source && l.target === target)[0]

//         if (link) {
//           link[isRight ? 'setRight' : 'setLeft'](true)
//         } else {
//           linksCollection.add({
//             source,
//             target,
//             left: !isRight,
//             right: isRight,
//           })
//         }

//         // select new link
//         selectedLink = link
//         selectedNode = null
//         redraw()
//       })

//     // show node IDs
//     g.append('svg:text')
//       .attr('x', 0)
//       .attr('y', 4)
//       .attr('class', 'id')
//       .text((d: GraphNode) => d.label)

//     group = g.merge(group)

//     // set the graph in motion
//     force
//       .nodes(nodesCollection.value)
//       .force('link')
//       .links(linksCollection.value)

//     force.alphaTarget(0.3).restart()
//   }, [])

//   function mousedown() {
//     d3.event.preventDefault()
//     // // because :active only works in WebKit?
//     // svg.classed('active', true)

//     // if (d3.event.ctrlKey || mousedownNode || mousedownLink) { return }

//     // // insert new node at point
//     // const point = d3.mouse(this)
//     // const node = {
//     //   id: nodesCollection.last().id + 1,
//     //   reflexive: false,
//     //   x: point[0],
//     //   y: point[1],
//     // }
//     // nodesCollection.add(node)

//     redraw()
//   }

//   function mousemove() {
//     d3.event.preventDefault()
//     if (!mousedownNode) { return }

//     // update drag line
//     dragLine.attr('d', `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${d3.mouse(this)[1]}`)
//     redraw()
//   }

//   function mouseup() {
//     if (mousedownNode) {
//       // hide drag line
//       dragLine
//         .classed('hidden', true)
//         .style('marker-end', '')
//     }

//     // because :active only works in WebKit?
//     svg.classed('active', false)

//     // clear mouse event vars
//     resetMouseVars()
//   }

//   useEffect(() => {
//     redraw()
//   }, [nodesCollection.value.length, linksCollection.value.length])

//   return (
//     <S.D3Wrapper>
//       <svg ref={svgRef} width={width} height={height} onContextMenu={() => false} />

//       {useToolbar({
//         svg: svgRef,
//       })}
//     </S.D3Wrapper>
//   )
// }

// export default hot(module)(observer(Landing))
