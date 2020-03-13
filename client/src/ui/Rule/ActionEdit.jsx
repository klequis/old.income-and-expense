import React, { useState } from 'react'
import PropTypes, { string } from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Select from 'ui/elements/Select'
import ActionControls from './ActionControls'
import { makeStyles } from '@material-ui/styles'
import { mergeRight } from 'ramda'

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

const Action = ({ action: Action, handleDirtyChange, handleActionChange }) => {
  // const {}
  const {
    _id,
    action,
    field,
    findValue,
    numAdditionalChars,
    replaceWithValue,
    category1,
    category2
  } = Action
  const [_action, _setAction] = useState(action)
  const [_values, _setValues] = useState({
    _id: _id,
    action: action,
    field: field,
    findValue: findValue,
    numAdditionalChars: numAdditionalChars,
    replaceWithValue: replaceWithValue,
    category1: category1,
    category2: category2
  })
  const _classes = useStyles()

  const _handleChange = event => {
    const { name, value } = event.target
    const newValues = mergeRight(_values, { [name]: value })
    _setValues(newValues)
    handleDirtyChange(true)
    handleActionChange(newValues)
  }

  return (
    <div key={_id} className={_classes.wrapper}>
      <div className={_classes.editModeWrapper}>
        <Select name="action" value={_values.action} onChange={_handleChange} >
          <MenuItem value="omit">Omit</MenuItem>
          <MenuItem value="strip">Strip</MenuItem>
          <MenuItem value="replaceAll">Replace all</MenuItem>
          <MenuItem value="categorize">Categorize</MenuItem>
        </Select>
        <ActionControls values={_values} handleChange={_handleChange} />
      </div>
    </div>
  )
}

export default Action

Action.propTypes = {
  action: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    field: PropTypes.string,
    findValue: PropTypes.string,
    numAdditionalChars: PropTypes.number,
    replaceWithValue: PropTypes.string,
    category1: PropTypes.string,
    category2: PropTypes.string
  })
}