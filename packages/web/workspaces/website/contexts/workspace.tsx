import {createContext, createRef} from 'react'

export const WorkspaceContext = createContext(createRef<HTMLDivElement>())
