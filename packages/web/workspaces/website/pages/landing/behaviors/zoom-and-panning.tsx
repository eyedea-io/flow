import {GRID} from '@website/constants'
import {useStore} from '@website/hooks/use-store'
import * as d3 from 'd3'

export const zoomHandler = (
  wrapper: React.MutableRefObject<any>
) => {
  const {nodeStore: {transform, setTransform}} = useStore()
  let contentTransform = d3.zoomIdentity
    .translate(transform.x, transform.y)
    .scale(transform.k)
  const zoom = d3
    .zoom<SVGSVGElement, any>()
    .scaleExtent([1 / 4, 4])
    .filter(() =>
      // Is middle button pressed - used for panning
      d3.event.button === 1 ||
      // Is scroll and ctrl is pressed - used for zoom
      d3.event.button === 0 && d3.event.ctrlKey
    )
    .on('zoom', () => {
      const node = d3.select(wrapper.current)
      const svg = node.select<SVGSVGElement>('svg').node()

      if (svg === null) {
        return
      }

      contentTransform = d3.event.transform
      setTransform(contentTransform)

      node
        .select('.scale')
        .attr('transform', `scale(${d3.event.transform.k})`)
      node
        .select('.transform')
        .attr('transform', `translate(${d3.event.transform.x}  ${d3.event.transform.y})`)
      node
        .select('.grid > rect')
        .attr('height', svg.clientHeight / (contentTransform.k))
        .attr('width', svg.clientWidth / (contentTransform.k))
        .attr('x', -contentTransform.x / contentTransform.k)
        .attr('y', -contentTransform.y / contentTransform.k)
    })

  return (svg: d3.Selection<SVGSVGElement, {}, null, undefined>) => {
    svg.call(zoom)
    const zoomRef = svg.on('wheel.zoom')

    svg.call(zoom.transform, contentTransform)
    svg
      .on('wheel.zoom', function() {
        // Zoom
        if (d3.event.ctrlKey && zoomRef !== undefined) {
          zoomRef.call(this, this, 0, [])
          d3.event.preventDefault()
          d3.event.stopImmediatePropagation()
        // Panning
        } else {
          const x = d3.event.shiftKey || d3.event.deltaX !== 0 ? Math.sign(d3.event.wheelDelta) * GRID * 2 : 0
          const y = d3.event.shiftKey || d3.event.deltaY === 0 ? 0 : Math.sign(d3.event.wheelDelta) * GRID * 2
          contentTransform = contentTransform.translate(x, y)
          svg.call(zoom.transform, contentTransform)
        }
      })
  }
}
