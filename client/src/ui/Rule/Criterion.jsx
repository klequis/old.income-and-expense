import React, { useState } from 'react'
import Select from 'ui/elements/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/styles'
import { operators, dataFields } from 'global-constants'
import TextField from 'ui/elements/TextField'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getData } from 'store/data/selectors'

import RemoveIcon from '@material-ui/icons/Remove'
import CancelIcon from '@material-ui/icons/Cancel'
import DoneIcon from '@material-ui/icons/Done'

import IconButton from '@material-ui/core/IconButton'

// import { dataReadByCriteriaRequest } from 'store/data/actions'
import { mergeRight } from 'ramda'

// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    padding: '4px 8px'
  },
  field: {
    marginRight: 10
  },
  actions: {
    // backgroundColor: 'red',
    display: 'flex',
    alignItems: 'flex-end',
    marginLeft: 35
  },
  notEditMode: {
    display: 'flex',
    alignItems: 'center'
  },
  notEditModeField: {
    marginRight: 20
  }
})

const Criterion = ({ criterion, updateCriterion, editMode }) => {
  const { _id, field, operation, value } = criterion
  // green('Criterion: criterion', criterion)

  const [values, setValues] = useState({
    _id,
    field,
    operation,
    value
  })
  // green('Criterion: values', values)

  const handleChange = event => {
    const { name, value } = event.target
    setValues(mergeRight(values, { [name]: value }))
  }

  // const _updateRule = () => {
  //   const { _id, field, operation, value } = values
  //   console.group('Criterion._updateRule')
  //   green('_id', _id)
  //   green('field', field)
  //   green('operation', operation)
  //   green('value', value)
  //   console.groupEnd()
  //   updateRule({ newCriterion: { _id, field, operation, value }})

  //   // TODO: 1. make server return updated todo
  //   // TODO: 2. update rules in redux
  //   // TODO: 3. UI should ubpate in response to redux update

  //   // TODO: but how about updating the records?
  //   // TODO: should the query above also get the matching records
  //   // TODO: will the current page be empty or go away
  //   // TODO: should edit rule be in a modal and changes only applied when user click button on modal?

  //   setEditMode(false)
  // }

  // const handleEditCriterionClick = () => setEditMode(!editMode)

  const classes = useStyles()

  if (editMode === false) {
    // green('editMode', false)
    return (
      <div className={classes.notEditMode}>
        <div className={classes.notEditModeField}>{field}</div>
        <div className={classes.notEditModeField}>{operation}</div>
        <div className={classes.notEditModeField}>{value}</div>
      </div>
    )
  } else {
    // green('editMode', true)
    return (
      <div className={classes.wrapper}>
        <div /*className={classes.fields}*/>
          <Select
            className={classes.field}
            name="field"
            value={values.field}
            onChange={handleChange}
          >
            <MenuItem value={dataFields.description}>Description</MenuItem>
            <MenuItem value={dataFields.typeOrig}>Type</MenuItem>
          </Select>

          <Select
            className={classes.field}
            name="operation"
            value={values.operation}
            onChange={handleChange}
          >
            <MenuItem value={operators.beginsWith}>Begins With</MenuItem>
            <MenuItem value={operators.contains}>Contains</MenuItem>
            <MenuItem value={operators.equals}>Equals</MenuItem>
            <MenuItem value={operators.regex}>RegEx</MenuItem>
            <MenuItem value={operators.in}>In</MenuItem>
          </Select>
          <TextField
            className={classes.field}
            name="value"
            label="value"
            value={values.value}
            onChange={handleChange}
            fullWidth
          />
        </div>
        <div className={classes.actions}>
          <IconButton>
            <CancelIcon />
          </IconButton>
          <IconButton>
            <DoneIcon />
          </IconButton>
          <IconButton>
            <RemoveIcon />
          </IconButton>
        </div>
      </div>
    )
  }
}

// const actions = {
//   dataReadByCriteriaRequest
// }

// const mapStateToProps = state => {
//   return {
//     data: getData(state)
//   }
// }

// export default compose(connect(mapStateToProps, actions))(Criterion)
export default Criterion
