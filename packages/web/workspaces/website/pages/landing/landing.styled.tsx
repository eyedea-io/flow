import styled from '@shared/utils/styled'

export default {
  D3Wrapper: styled.div`
    height: 100vh;
    background-color: rgb(240, 244, 247);

    svg {
      cursor: default;
      display: block;
      user-select: none;
    }

    /* svg:not(.active):not(.ctrl) {
      cursor: crosshair;
    } */

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
  `,
}
