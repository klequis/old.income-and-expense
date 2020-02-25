import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Action from './Action'
// eslint-disable-next-line
import { green, red } from 'logger'

const Actions = ({ actions }) => {
  return actions.map(a => <Action action={a} />)
}

export default Actions