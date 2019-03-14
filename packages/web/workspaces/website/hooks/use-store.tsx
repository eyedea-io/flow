import {StoreContext} from '@website/contexts/store'
import {Store} from '@website/stores'
import {useContext} from 'react'

export const useStore = () => useContext<Store>(StoreContext)
