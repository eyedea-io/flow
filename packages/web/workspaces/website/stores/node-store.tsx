import {theme} from '@shared/theme'
import {LinkCollection} from '@website/types/link-collection'
import {NodeCollection} from '@website/types/node-collection'
import {NodeType} from '@website/types/node-type'
import {Instance, types} from 'mobx-state-tree'

const nodeTypes: NodeType[] = [
  {
    name: 'Project',
    color: theme.fills.subtle.blue.color,
    schema: {
      title: {
        component: 'input',
        label: 'title',
      },
    },
  },
  {
    name: 'Endpoint',
    color: theme.fills.subtle.green.color,
    schema: {
      title: {
        component: 'input',
        label: 'title',
      },
    },
  },
  {
    name: 'Context',
    color: theme.fills.subtle.orange.color,
    schema: {
      title: {
        component: 'input',
        label: 'title',
      },
    },
  },
  {
    name: 'Component',
    color: theme.fills.subtle.purple.color,
    schema: {
      title: {
        component: 'input',
        label: 'title',
      },
      workspace: {
        component: 'select',
        label: 'workspace',
        options: [
          {label: 'shared', value: 'shared'},
          {label: 'website', value: 'website'},
        ],
      },
      props: {
        component: 'json-schema',
        label: 'props',
      },
    },
  },
]

const WorkspaceTransform = types
  .model('WorkspaceTransform', {
    k: types.number,
    x: types.number,
    y: types.number,
  })

export const NodeStore = types
  .model('NodeStore', {
    transform: types.optional(WorkspaceTransform, {k: 1, x: 0, y: 0}),
    nodeTypes: types.optional(types.array(NodeType), nodeTypes),
    nodesCollection: types.optional(NodeCollection, {}),
    linksCollection: types.optional(LinkCollection, {}),
  })
  .actions(self => ({
    setTransform(transform: d3.ZoomTransform) {
      self.transform.k = transform.k
      self.transform.x = transform.x
      self.transform.y = transform.y
    },
  }))

export interface NodeCollection extends Instance<typeof NodeCollection> {}
