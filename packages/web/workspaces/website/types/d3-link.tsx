import {Instance, types} from 'mobx-state-tree'
import {v4} from 'uuid'
import {D3Node} from './d3-node'

export const SPACING = 2.5

export const D3Link = types
  .model('D3Link', {
    uuid: types.optional(types.string, v4()),
    source: types.reference(D3Node),
    target: types.reference(D3Node),
    left: types.optional(types.boolean, false),
    right: types.optional(types.boolean, false),
    // x: types.number,
    // y: types.number,
  })
  .actions(self => ({
    setRight(value: boolean) {
      self.right = value
    },
    setLeft(value: boolean) {
      self.left = value
    },
  }))
  .views(self => ({
    startAndEnd(): [number, number][] {
      return [
        calculatePosition(self.source, self.target, SPACING),
        calculatePosition(self.target, self.source, SPACING),
      ]
    },
  }))
  .views(self => ({
    get isStraightLine() {
      const {snapX: sx, snapY: sy, width: sw, height: sh} = self.source
      const {snapX: tx, snapY: ty, width: tw} = self.target

      return (
        ((sx + sw <= tx) && (sy + sh <= ty)) ||
        ((sx <= tx + tw) && (sy + sh <= ty)) ||
        ((sx >= tx + tw) && (sy + sh <= ty)) ||
        ((sx + sw <= tx) && (sy + sh > ty)) ||
        ((sx <= tx + tw) && (sy + sh > ty)) ||
        ((sx >= tx + tw) && (sy + sh > ty))
      ) && (sx + sw >= tx) && (sx <= tx + tw)
    },
  }))

export interface D3Link extends Instance<typeof D3Link> {}

export function calculatePosition(s: D3Node, t: D3Node, spacing: number): [number, number] {
  const {snapX: sx, snapY: sy, width: sw, height: sh} = s
  const {snapX: tx, snapY: ty, width: tw} = t
  const commonPart = (tx + tw) - sx -
    (sx >= tx ? 0 : tx - sx) -
    (tx + tw < sx + sw ? 0 : tx + tw - (sx + sw))

  return [
    sx >= tx + tw ? sx - (sx > tx + tw ? spacing : 0)
      : sx + sw <= tx ? sx + sw + (sx + sw < tx ? spacing : 0)
      : sx <= tx + tw ? Math.max(tx, sx) + commonPart / 2
      : sx + sw / 2,
    sx + sw < tx ? sy + sh / 2
      : sx > tx + tw ? sy + sh / 2
      : sy + sh > ty ? sy - spacing
      : sy + sh <= ty ? sy + sh + spacing
      : sy + sh / 2,
  ]
}
