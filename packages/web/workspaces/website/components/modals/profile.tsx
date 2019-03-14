import {useStore} from '@website/hooks/use-store'
import * as React from 'react'

const Profile = () => {
  const {userStore} = useStore()

  return (
    <div>
      <b>Email:</b> {userStore.profile ? userStore.profile.username : ''}
    </div>
  )
}

export {Profile}
