import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import TextField from 'ui/elements/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from 'ui/elements/Select'
import { dataFields, actions } from 'global-constants'

// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  viewModeField: {
    marginRight: 20
  }
})

const ActionControls = ({ action: Action, editMode }) => {
  const {
    action,
    field,
    findValue,
    numAdditionalChars,
    replaceWithValue,
    category1,
    category2
  } = Action
  const [_field, _setField] = useState(field)
  const [_findValue, _setFindValue] = useState(findValue)
  const [_numAdditionalChars, _setNumAdditionalChars] = useState(
    numAdditionalChars
  )
  const [_replaceWithValue, _setReplaceWithValue] = useState(replaceWithValue)
  const [_category1, _setCategory1] = useState(category1)
  const [_category2, _setCategory2] = useState(category2)

  const handleChange = event => {}
  
  const classes = useStyles()

  if (action === actions.omit) {
    return null
  }
  if (action === actions.strip) {
    return (
      <>
        {!editMode ? (
          <div>
            <span className={classes.viewModeField}>{_field}</span>
            <span className={classes.viewModeField}>{_findValue}</span>
            <span className={classes.viewModeField}>{_numAdditionalChars}</span>
          </div>
        ) : (
          <>
            <Select name="action.field" value={_field} onChange={handleChange}>
              <MenuItem value={dataFields.description}>Description</MenuItem>
              <MenuItem value={dataFields.origType}>Type</MenuItem>
            </Select>
            <TextField
              name="action.findValue"
              label="findValue"
              value={_findValue}
            />
            <TextField
              name="action.numAdditionalChars"
              label="numAdditionalChars"
              value={_numAdditionalChars}
            />
          </>
        )}
      </>
    )
  }
  if (action === actions.replaceAll) {
    return (
      <>
        {!editMode ? (
          <div>
            <span className={classes.viewModeField}>{_field}</span>
            <span className={classes.viewModeField}>{_replaceWithValue}</span>
          </div>
        ) : (
          <>
            <Select name="action.field" value={_field} onChange={handleChange}>
              <MenuItem value={dataFields.description}>Description</MenuItem>
              <MenuItem value={dataFields.origType}>Type</MenuItem>
            </Select>
            <TextField
              name="action.replaceWithValue"
              label="replace with"
              value={_replaceWithValue}
            />
          </>
        )}
      </>
    )
  }
  if (action === actions.categorize) {
    return (
      <>
        {!editMode ? (
          <div>
            <span className={classes.viewModeField}>{_category1}</span>
            <span className={classes.viewModeField}>{_category2}</span>
          </div>
        ) : (
          <>
            <TextField id={`category1`} label="category1" value={_category1} />
            <TextField id={`category2`} label="category2" value={_category2} />
          </>
        )}
      </>
    )
  }
  redf('Rule.ActionControls ERROR:', `unknown action ${action.action}`)
  return null
}

export default ActionControls