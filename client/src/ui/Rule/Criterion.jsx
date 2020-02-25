import React, { useState } from 'react'
import Select from 'ui/elements/Select'
import MenuItem from 'ui/elements/MenuItem'
import { makeStyles } from '@material-ui/styles'
import { operators, dataFields } from 'global-constants'
import TextField from 'ui/elements/TextField'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getData } from 'store/data/selectors'
import { dataReadByCriteriaRequest } from 'store/data/actions'

// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    // display: 'flex',
    // alignItems: 'flex-end'
    padding: '4px 8px'
  },
  field: {
    marginRight: 10
  }
})

const Criterion = ({ criteria }) => {
  const { field, operation, value } = criteria
  const [_field, _setField] = useState(field)
  const [_operation, _setOperation] = useState(operation)
  const [_value, _setValue] = useState(value)
  const a = {
    field,
    _field,
    _operation,
    _value
  }
  // green('a', a)

  const handleChange = event => {
    const { name, value } = event.target
    green('name', name)
    green('value', value)

    switch (name) {
      case 'criteria.field':
        green('value', value)
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
  }
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Select
        className={classes.field}
        name="criteria.field"
        value={_field}
        onChange={handleChange}
      >
        <MenuItem value={dataFields.description}>Description</MenuItem>
        <MenuItem value={dataFields.typeOrig}>Type</MenuItem>
      </Select>

      <Select
        className={classes.field}
        name="criteria.operation"
        value={_operation}
        onChange={handleChange}
      >
        <MenuItem value={operators.beginsWith}>Begins With</MenuItem>
        <MenuItem value={operators.contains}>Contains</MenuItem>
        <MenuItem value={operators.equals}>Equals</MenuItem>
        <MenuItem value={operators.regex}>RegEx</MenuItem>
        <MenuItem value={operators.in}>$in</MenuItem>
      </Select>
      <TextField
        className={classes.field}
        name="criteria.value"
        label="value"
        value={_value}
        onChange={handleChange}
        fullWidth
      />
    </div>
  )
}

const actions = {
  dataReadByCriteriaRequest
}

const mapStateToProps = state => {
  return {
    data: getData(state)
  }
}

export default compose(connect(mapStateToProps, actions))(Criterion)
