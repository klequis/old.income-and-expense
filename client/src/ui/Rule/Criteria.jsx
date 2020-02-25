import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Criterion from './Criterion'
import shortid from 'shortid'
// eslint-disable-next-line
import { green, red } from 'logger'

const Criteria = ({ criteria }) => {
  return criteria.map(c => <Criterion key={shortid.generate()} criteria={c} />)
}

export default Criteria