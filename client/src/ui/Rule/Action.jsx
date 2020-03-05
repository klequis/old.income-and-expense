import React, { useState } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Select from 'ui/elements/Select'
import ActionControls from './ActionControls'
import { makeStyles } from '@material-ui/styles'
import shortid from 'shortid'

// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  editModeWrapper: {
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'flex-end'
  },
  notEditModeWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  notEditModeField: {
    marginRight: 20
  }
})

const Action = props => {
  const {
    action: origAction,
    field,
    findValue,
    numAdditionalChars,
    replaceWithValue,
    category1,
    category2,
    editMode
  } = props

  const [action, setAction] = useState(origAction.action)
  const classes = useStyles()

  const handleChange = event => {
    const { name, value } = event.target
    switch (name) {
      case 'action-select':
        setAction(value)
        break
      default:
        redf('Rule.handleChange ERROR', `Unknown action ${name}`)
    }
  }
  return (
    <div key={shortid.generate()} className={classes.wrapper}>
      {!editMode ? (
        <div className={classes.notEditModeWrapper}>
          <div className={classes.notEditModeField}>{action}</div>
          <ActionControls action={props.action} editMode={editMode} />
        </div>
      ) : (
        <div className={classes.editModeWrapper}>
          <Select name="action-select" value={action} onChange={handleChange}>
            <MenuItem value="omit">Omit</MenuItem>
            <MenuItem value="strip">Strip</MenuItem>
            <MenuItem value="replaceAll">Replace all</MenuItem>
            <MenuItem value="categorize">Categorize</MenuItem>
          </Select>
          <ActionControls action={props.action} editMode={editMode} />
        </div>
      )}
    </div>
  )
}

export default Action
