import * as React from 'react'
import Paragraph from './paragraph'

const component = (props) => (
  <div>
     {/* tslint:disable-next-line:max-line-length */}
    <Paragraph {...props}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam iaculis, ante vel ornare dignissim, velit dolor molestie odio, at elementum risus sapien ut eros. Proin efficitur nibh tellus. Proin malesuada tristique purus ac molestie. Integer imperdiet blandit interdum. Praesent ipsum metus, pharetra in blandit in, auctor non massa. Nam vehicula non elit ac congue. Vivamus erat tellus, bibendum sed massa aliquam, lacinia rutrum odio. Suspendisse auctor, quam eu consectetur condimentum, mi tellus dictum tellus, id scelerisque leo purus eget neque. Aenean accumsan est ac magna condimentum, eget maximus nisl faucibus. Etiam pulvinar velit tellus, ac gravida est faucibus nec. Ut commodo quam ipsum, mattis consectetur tellus convallis ac. Pellentesque non libero ac dolor aliquam laoreet. Praesent a dapibus ante, non sodales risus. Phasellus hendrerit sapien quis porta lacinia.</Paragraph>
     {/* tslint:disable-next-line:max-line-length */}
    <Paragraph {...props}>Quisque sit amet ex ac purus tristique gravida ac id odio. Phasellus ut magna non lorem venenatis maximus ac eget ligula. Mauris pretium magna dapibus ipsum tincidunt rutrum. Suspendisse mattis erat a iaculis sodales. Donec sem nibh, iaculis non ligula eget, mattis egestas tortor. Vestibulum quis turpis non lectus cursus semper sit amet id augue. Nulla id orci laoreet, sagittis velit et, ultrices metus. Nullam in dignissim ante. Proin vulputate risus euismod consectetur pharetra. Mauris nec molestie quam. Fusce sed ante sed lacus pretium viverra eget vitae turpis. Vivamus in odio non nulla pulvinar sagittis eu eget elit. Mauris rutrum urna vitae sagittis accumsan. Sed vitae tortor sed leo dapibus ultrices. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas ultrices risus sed sapien imperdiet, et imperdiet lorem posuere.</Paragraph>
  </div>
)

component.displayName = 'shared/components/Paragraph'

export default [
  {
    component,
    name: 'size:300',
    wrap: true,
    props: {
      size: 300,
    },
  },
  {
    component,
    name: 'size:400:default',
    wrap: true,
  },
  {
    component,
    name: 'size:500',
    wrap: true,
    props: {
      size: 500,
    },
  },
  {
    component,
    name: 'color:muted',
    wrap: true,
    props: {
      color: 'muted',
    },
  },
  {
    component,
    name: 'color:default',
    wrap: true,
    props: {
      color: 'default',
    },
  },
  {
    component,
    name: 'color:dark',
    wrap: true,
    props: {
      color: 'dark',
    },
  },
  {
    component,
    name: 'fontFamily:mono',
    wrap: true,
    props: {
      fontFamily: 'mono',
    },
  },
  {
    component,
    name: 'fontFamily:ui',
    wrap: true,
    props: {
      fontFamily: 'ui',
    },
  },
  {
    component,
    name: 'fontFamily:display',
    wrap: true,
    props: {
      fontFamily: 'display',
    },
  },
]
