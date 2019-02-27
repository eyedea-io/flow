import {Store, StoreContext} from '@website/stores'
import {useContext} from 'react'

export const useStore = () => useContext<Store>(StoreContext)
