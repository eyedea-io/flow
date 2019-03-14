import * as Router from '@reach/router'
// import {Button} from '@shared/components/button'
import {Input} from '@shared/components/input'
import {InputList} from '@shared/components/input-list'
import {Link} from '@shared/components/link'
import {Title} from '@shared/components/title'
// import {isEmail} from '@shared/utils/is-email'
import {AuthForm, Heading} from '@website/pages/auth/styled'
import {WithStore} from '@website/types'
import {as} from '@website/utils/as'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import * as React from 'react'
import {hot} from 'react-hot-loader'

@inject('store')
@as.member(() => <Router.Redirect to="/" noThrow />)
@hot(module)
@observer
class Login extends React.Component<WithStore> {
  private errors = observable.map()
  private isLoading = observable.box(false)
  private form = this.props.store.formStore.add('login', {
    username: {
      autoFocus: true,
      placeholder: 'Type email...',
    },
    password: {
      type: 'password',
      placeholder: 'Type password...',
    },
  })

  render() {
    const {t} = this.props.store

    return (
      <React.Fragment>
        <Title>Login</Title>
        <AuthForm onSubmit={this.handleSubmit}>
          <Heading>{t`Welcome back!`}</Heading>

          <InputList errors={this.errors}>
            <Input value={this.form.value('username')} {...this.form.field('username')} />
            <Input value={this.form.value('password')} {...this.form.field('password')}/>
          </InputList>

          {/* <Button appearance="primary" loading={this.isLoading.get()} disabled={!this.allowSubmit}>
            {t`Sign in`}
          </Button> */}
          <Link mt="xxs" to="/auth/register">{t`Create account`}</Link>
        </AuthForm>
      </React.Fragment>
    )
  }

  // private get allowSubmit(): boolean {
  //   return isEmail(this.form.value('username')) && this.form.value('password')
  // }

  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      this.isLoading.set(true)
      await this.props.store.userStore.login(this.form.data)
    } catch (err) {
      this.errors.replace(err.response.data)
    } finally {
      this.isLoading.set(false)
    }
  }
}

export default Login
