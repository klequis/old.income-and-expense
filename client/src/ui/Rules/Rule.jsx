import React, { useState } from 'react'
// import TextField from '@material-ui/core/TextField'
// import MenuItem from '@material-ui/core/MenuItem'
// import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/styles'
import Action from './Action'
import Criteria from './Criteria'

// eslint-disable-next-line
import { green, redf } from 'logger'

/*
  - action
  - field
  - findValue
  - numAdditionalChars
  - replaceWithValue
  - category1
  - category2
*/

/*
  - omit:       action
  - strip:      action, field, findValue, numAdditionalChars
  - replaceAll: action, field, replaceWithValue
  - categorize: action, category1, category2

*/
const useStyles = makeStyles({
  panel: {
    backgroundColor: 'red',
    padding: '4px 8px'
  }
})

const Rule = ({ criteria, actions }) => {
  // green('criteria', criteria)
  // green('actions', actions)
  const classes = useStyles()
  return (
    <form className={classes.panel}>
      <div>
        <div>Criteria</div>

        {criteria.map(c => (
          <Criteria criteria={c} />
        ))}
      </div>
      <div>
        <div>Actions</div>
        {actions.map(a => (
          <Action action={a} />
        ))}
        {/* {actions.map(a => {
          return (
            <TextField
              id="action.action"
              label="action"
              value={a.action}
            />
          )
        })} */}
      </div>
    </form>
  )
}

export default Rule
