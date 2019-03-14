import {Instance, isModelType, types} from 'mobx-state-tree'

export const NodeDataModel = types
  .model('NodeData', {
    value: types.frozen<{title?: string}>({}),
  })
  .postProcessSnapshot(snapshot => snapshot.value)
  .views(self => ({
    get(key: string, defaultValue?: any) {
      return self.value[key] !== undefined ? self.value[key] : defaultValue
    },
  }))
  .actions(self => ({
    setValue(key: string, value: any) {
      self.value = {
        ...self.value,
        [key]: value,
      }
    },
  }))

export const NodeData = types.custom<any, NodeDataModel>({
  name: 'NodeData',
  fromSnapshot(value: any): NodeDataModel {
    return NodeDataModel.create({value})
  },
  toSnapshot(model: NodeDataModel): any {
    return model.value
  },
  isTargetType(value: any): boolean {
    if (isModelType(value)) {
      return value.is(NodeDataModel)
    }

    return false
  },
  getValidationMessage(value: any): string {
    if (typeof value !== 'object' || value === null) {
      return `${value} does not look like valid node data`
    }

    return ''
  },
})

export interface NodeDataModel extends Instance<typeof NodeDataModel> {}
