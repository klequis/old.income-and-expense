import React, { useState } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import ActionControls from './ActionControls'
import { makeStyles } from '@material-ui/styles'

// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    // backgroundColor: 'blue',
    padding: '4px 8px',
    display: 'flex',
    // justifyContent: 'space-around',
    alignItems: 'flex-end'
  }
})

const Action = props => {
  // receives 'action' object
  // green('props', props)
  const {
    action: origAction,
    field,
    findValue,
    numAdditionalChars,
    replaceWithValue,
    category1,
    category2
  } = props
  const [action, setAction] = useState(origAction.action)
  // green('action', action)

  const classes = useStyles()

  const handleChange = event => {
    const { name, value } = event.target
    // green('target.name', name)
    // green('target.value', value)
    switch (name) {
      case 'action-select':
        setAction(value)
        break
      default:
        redf('Rule.handleChange ERROR', `Unknown action ${name}`)
    }
    // setAge(event.target.value)
  }

  return (
    <div id='action' className={classes.wrapper}>
      <Select name="action-select" value={action} onChange={handleChange}>
        <MenuItem value="omit">Omit</MenuItem>
        <MenuItem value="strip">Strip</MenuItem>
        <MenuItem value="replaceAll">Replace all</MenuItem>
        <MenuItem value="categorize">Categorize</MenuItem>
      </Select>

      <ActionControls action={props.action} />
    </div>
  )
}

export default Action