import Text from './text'

export default [
  {
    component: Text,
    name: 'size:300',
    wrap: true,
    props: {
      children: 'Hello world',
      size: 300,
    },
  },
  {
    component: Text,
    name: 'size:400:default',
    wrap: true,
    props: {
      children: 'Hello world',
    },
  },
  {
    component: Text,
    name: 'size:500',
    wrap: true,
    props: {
      children: 'Hello world',
      size: 500,
    },
  },
  {
    component: Text,
    name: 'size:600',
    wrap: true,
    props: {
      children: 'Hello world',
      size: 600,
    },
  },
  {
    component: Text,
    name: 'fontFamily:mono',
    wrap: true,
    props: {
      children: 'Hello world',
      fontFamily: 'mono',
    },
  },
  {
    component: Text,
    name: 'fontFamily:display',
    wrap: true,
    props: {
      children: 'Hello world',
      fontFamily: 'display',
    },
  },
  {
    component: Text,
    name: 'fontFamily:ui',
    wrap: true,
    props: {
      children: 'Hello world',
      fontFamily: 'ui',
    },
  },
  {
    component: Text,
    name: 'color:default',
    wrap: true,
    props: {
      children: 'Hello world',
    },
  },
  {
    component: Text,
    name: 'color:muted',
    wrap: true,
    props: {
      children: 'Hello world',
      color: 'muted',
    },
  },
  {
    component: Text,
    name: 'color:dark',
    wrap: true,
    props: {
      children: 'Hello world',
      color: 'dark',
    },
  },
]
