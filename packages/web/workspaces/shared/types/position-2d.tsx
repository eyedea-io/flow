import {Instance, isModelType, types} from 'mobx-state-tree'

export const Position2DModel = types
  .model('Position2D', {
    x: 0,
    y: 0,
  })
  .actions(self => ({
    setX(value: number) {
      self.x = value
    },
    setY(value: number) {
      self.y = value
    },
    setValue(value: [number, number]) {
      self.x = value[0]
      self.y = value[0]
    },
  }))

export const Position2D = types.custom<[number, number], Position2DModel>({
  name: 'Bool',
  fromSnapshot(value: [number, number]): Position2DModel {
    return Position2DModel.create({
      x: value[0],
      y: value[1],
    })
  },
  toSnapshot(model: Position2DModel): [number, number] {
    return [model.x, model.y]
  },
  isTargetType(value: any): boolean {
    if (isModelType(value)) {
      return value.is(Position2DModel)
    }

    return false
  },
  getValidationMessage(value: any): string {
    if (!Array.isArray(value) || value.length !== 2 || value.some(item => typeof item !== 'number')) {
      return `${value} does not look like a position([x, y])`
    }

    return ''
  },
})

export interface Position2DModel extends Instance<typeof Position2DModel> {}
// type BoolType = typeof Bool.Type
// export interface Bool extends BoolType {}
