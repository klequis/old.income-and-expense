import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/styles'

// eslint-disable-next-line
import { green, redf } from 'logger'

const ActionControls = ({ action }) => {
  green('action', action)
  
  // green('action.action', action.action)
  if (action.action === 'omit') {
    return null
  }
  if (action.action === 'strip') {
    return (
      <>
        <TextField id={`field`} label="field">
          {action.field}
        </TextField>
        <TextField id={`findValue`} label="findValue">
          {action.findValue}
        </TextField>
        <TextField id={`numAdditionalChars`} label="numAdditionalChars">
          {action.numAdditionalChars}
        </TextField>
      </>
    )
  }
  if (action.action === 'replaceAll') {
    return (
      <>
        <TextField id={`field`} label="field">
          {action.field}
        </TextField>
        <TextField id={'replacewithValue'} label="replace with">
          {action.replaceWithValue}
        </TextField>
      </>
    )
  }
  if (action.action === 'categorize') {
    return (
      <>
        <TextField id={`field`} label="field">
          {action.field}
        </TextField>
        <TextField id={`category1`} label="category1">
          {action.category1}
        </TextField>
        <TextField id={`category2`} label="category2">
          {action.category2}
        </TextField>
      </>
    )
  }
  return null
  redf('Rule.ActionControls ERROR:', `unknown action ${action.action}`)
}

export default ActionControls