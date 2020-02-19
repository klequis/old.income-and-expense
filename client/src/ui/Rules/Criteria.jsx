import React from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: 'green'
    // padding: '4px 8px'
  }
})

const Criteria = ({ criteria }) => {
  green('Criteria: criteria', criteria)
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <TextField id="criteria.field" label="field" value={criteria.field} />

      <TextField
        id="criteria.operation"
        label="operation"
        value={criteria.operation}
      />

      <TextField id="criteria.value" label="value" value={criteria.value} />
    </div>
  )
}

export default Criteria
