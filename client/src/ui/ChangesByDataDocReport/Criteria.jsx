import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Criterion from './Criterion'
// eslint-disable-next-line
import { green, red } from 'logger'

const Criteria = ({ criteria }) => {
  return criteria.map(c => <Criterion criteria={c} />)
}

export default Criteria