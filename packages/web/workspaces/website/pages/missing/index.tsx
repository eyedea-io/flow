import {Link} from '@shared/components/link'
import {Title} from '@shared/components/title'
import {useStore} from '@website/hooks/use-store'
import {View} from '@website/pages/missing/styled'
import * as React from 'react'

export const Missing = () => {
  const {t} = useStore()

  return (
    <React.Fragment>
      <Title>Not Found</Title>

      <View>
        <h1>{t`Page was not found`}</h1>
        <Link mt="sm" to="/">{t`Back to home`}</Link>
      </View>
    </React.Fragment>
  )
}

export default Missing
