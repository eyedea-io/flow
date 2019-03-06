import {FormStore} from '@shared/types/form-store'
import {LangStore} from '@shared/types/lang-store'
import {UserStore} from '@shared/types/user-store'
import {createStore} from '@shared/utils/create-store'
import {Modal} from '@website/stores/modal'
import {Instance, types} from 'mobx-state-tree'
import * as React from 'react'
import {hot} from 'react-hot-loader'
import {NodeStore} from './node-store'

export const Store = hot(module)(types
  .model('Store', {
    modal: types.optional(Modal, {}),
    langStore: types.optional(LangStore, {}),
    userStore: types.optional(UserStore, {}),
    formStore: types.optional(FormStore, {}),
    nodeStore: types.optional(NodeStore, {}),
  }))
  .views(self => ({
    get t() {
      return self.langStore.t
    },
  }))

export interface Store extends Instance<typeof Store> {}
export const StoreContext = React.createContext<Store>(createStore(Store))
