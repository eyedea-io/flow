import {WorkspaceContext} from '@website/contexts/workspace'
import {useContext} from 'react'

export const useWorkspace = () => useContext(WorkspaceContext)
