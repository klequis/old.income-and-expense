import React, { useState } from 'react'
import TextField from 'ui/elements/TextField'
import MenuItem from 'ui/elements/MenuItem'
import Select from 'ui/elements/Select'
import { makeStyles } from '@material-ui/styles'
import { dataFields, actions } from 'global-constants'

// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  textField: {
    marginRight: 20
  }
})

const ActionControls = ({ action: Action }) => {
  green('action', Action)
  const { action, field, findValue, numAdditionalChars, replaceWithValue, category1, category2 } = Action
  // const [_action, _setAction] = useState(action)
  const [_field, _setField] = useState(field)
  const [_findValue, _setFindValue] = useState(findValue)
  const [_numAdditionalChars, _setNumAdditionalChars] = useState(
    numAdditionalChars
  )
  const [_replaceWithValue, _setReplaceWithValue] = useState(replaceWithValue)
  const [_category1, _setCategory1] = useState(category1)
  const [_category2, _setCategory2] = useState(category2)

  const handleChange = event => {

  }
  // green('action.action', action.action)
  if (action.action === actions.omit) {
    return null
  }
  if (action.action === actions.strip) {
    return (
      <>
        <Select name="action.field" value={_field} onChange={handleChange}>
          <MenuItem value={dataFields.description}>Description</MenuItem>
          <MenuItem value={dataFields.origType}>Type</MenuItem>
        </Select>
        <TextField name="action.findValue" label="findValue" value={_findValue} />
        <TextField name='action.numAdditionalChars' label="numAdditionalChars" value={_numAdditionalChars} />
      </>
    )
  }
  if (action.action === actions.replaceAll) {
    return (
      <>
        <Select name="action.field" value={_field} onChange={handleChange}>
          <MenuItem value={dataFields.description}>Description</MenuItem>
          <MenuItem value={dataFields.origType}>Type</MenuItem>
        </Select>
        <TextField name='action.replaceWithValue' label="replace with" value={_replaceWithValue} />
      </>
    )
  }
  if (action.action === actions.categorize) {
    return (
      <>
        <TextField id={`field`} label="field" value={_field} />
        <TextField id={`category1`} label="category1" value={_category1}/>
        <TextField id={`category2`} label="category2" value={_category2} />
      </>
    )
  }
  return null
  redf('Rule.ActionControls ERROR:', `unknown action ${action.action}`)
}

export default ActionControls
