import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/styles'
import { operators } from 'global-constants'
// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    // backgroundColor: 'green',
    padding: '4px 8px',
    display: 'flex',
    // justifyContent: 'space-around',
    alignItems: 'flex-end'
  }
})

const Criteria = ({ criteria }) => {
  const { field, operation, value } = criteria
  const [_field, _setField] = useState(field)
  const [_operation, _setOperation] = useState(operation)
  const [_value, _setValue] = useState(value)
  // green('Criteria: criteria', criteria)

  const handleChange = event => {
    const { name, value } = event.target
    // green('target.name', name)
    // green('target.value', value)
    switch (name) {
      case 'criteria.field':
        _setField(value)
        break
      case 'criteria.operation':
        _setOperation(value)
        break
      case 'criteria.value':
        _setValue(value)
        break
      default:
        redf('Rule.handleChange ERROR', `Unknown action ${name}`)
    }
    // setAge(event.target.value)
  }
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Select name="criteria.field" value={_field} onChange={handleChange}>
        <MenuItem value="description">Description</MenuItem>
        <MenuItem value="type">Type</MenuItem>
      </Select>
      
      <Select name="criteria.operation" value={_operation} onChange={handleChange}>
        <MenuItem value={operators.beginsWith}>Begins With</MenuItem>
        <MenuItem value="contains">Contains</MenuItem>
        <MenuItem value="equals">Equals</MenuItem>
        <MenuItem value="regex">RegEx</MenuItem>
      </Select>
      <TextField name="criteria.value" label="value" value={_value} onChange={handleChange} />
    </div>
  )
}

export default Criteria
