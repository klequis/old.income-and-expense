import React, { useState } from 'react'
import NewCriterion from './NewCriterion'
import NewAction from './NewAction'
import Paper from '@material-ui/core/Paper'

const NewRule = () => {
  return (
    <Paper>
      <NewCriterion />
      <NewAction />
    </Paper>
  )
}

export default NewRule