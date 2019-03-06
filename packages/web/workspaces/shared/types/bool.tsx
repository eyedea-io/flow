import {Instance, isModelType, types} from 'mobx-state-tree'

// tslint:disable-next-line:variable-name
export const BoolModel = types
  .model('Bool', {
    value: false,
  })
  .actions(self => ({
    setTrue() {
      self.value = true
    },
    setFalse() {
      self.value = false
    },
    toggle() {
      self.value = !self.value
    },
    setValue(value: boolean) {
      self.value = value
    },
  }))

export const Bool = types.custom<boolean, BoolModel>({
  name: 'Bool',
  fromSnapshot(value: boolean): BoolModel {
    return BoolModel.create({value})
  },
  toSnapshot(model: BoolModel): boolean {
    return model.value
  },
  isTargetType(value: any): boolean {
    if (isModelType(value)) {
      return value.is(BoolModel)
    }

    return false
  },
  getValidationMessage(value: any): string {
    return typeof value === 'boolean' ? '' : `${value} is not a boolean`
  },
})

export interface BoolModel extends Instance<typeof BoolModel> {}
