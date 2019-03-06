import * as d3 from 'd3'
import {GRID} from '../constants'

export const addZoomAndPanningBehavior = (
  wrapper: React.MutableRefObject<any>
) => {
  let contentTransform = d3.zoomIdentity
  const zoom = d3
    .zoom()
    .scaleExtent([1 / 3, 4])
    .filter(() =>
      // Is middle button pressed - used for panning
      d3.event.button === 1 ||
      // Is scroll and ctrl is pressed - used for zoom
      d3.event.button === 0 && d3.event.ctrlKey
    )
    .on('zoom', () => {
      const node = d3.select(wrapper.current)
      const {clientHeight, clientWidth} = node.select<SVGSVGElement>('svg').node()

      contentTransform = d3.event.transform

      node
        .select('.scale')
        .attr('transform', `scale(${d3.event.transform.k})`)
      node
        .select('.transform')
        .attr('transform', `translate(${d3.event.transform.x}  ${d3.event.transform.y})`)
      node
        .select('.grid > rect')
        .attr('height', clientHeight / (contentTransform.k))
        .attr('width', clientWidth / (contentTransform.k))
        .attr('x', -contentTransform.x / contentTransform.k)
        .attr('y', -contentTransform.y / contentTransform.k)
    })

  return (svg: d3.Selection<SVGElement, {}, null, undefined>) => {
    svg.call(zoom)
    const zoomRef = svg.on('wheel.zoom')

    svg
      .on('wheel.zoom', function() {
        // Zoom
        if (d3.event.ctrlKey) {
          zoomRef.call(this)
          d3.event.preventDefault()
          d3.event.stopImmediatePropagation()
        // Panning
        } else {
          const x = d3.event.shiftKey ? Math.sign(d3.event.wheelDelta) * GRID * 2 : 0
          const y = d3.event.shiftKey ? 0 : Math.sign(d3.event.wheelDelta) * GRID * 2

          contentTransform = contentTransform.translate(x, y)
          svg.call(zoom.transform, contentTransform)
        }
      })
  }
}
