import React, { useState } from 'react'
import Select from 'ui/elements/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/styles'
import { operators, dataFields } from 'global-constants'
import TextField from 'ui/elements/TextField'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getData } from 'store/data/selectors'
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
    display: 'flex'
  },
  notEditModeField: {
    marginRight: 20
  }
})

const Actions = ({ handleEditCriterionClick, editMode, updateRule }) => {
  green('Actions: editMode', editMode)
  const classes = useStyles()
  return (
    <div className={classes.actions}>
      <button onClick={handleEditCriterionClick}>
        {editMode ? 'Cancel' : 'Edit Criteria'}
      </button>
      {editMode ? <button onClick={updateRule}>Apply</button> : null}
    </div>
  )
}

const Criterion = ({ criterion, updateRule }) => {
  const { field, operation, value } = criterion
  const [editMode, setEditMode] = useState(false)

  const [values, setValues] = useState({
    field: field,
    operation: operation,
    value: value
  })

  const handleChange = event => {
    const { name, value } = event.target
    setValues(mergeRight(values, { [name]: value }))
  }

  const _updateRule = () => {
    const { field, operation, value } = values
    updateRule({ criterion: { field, operation, value }})
  }

  const handleEditCriterionClick = () => setEditMode(!editMode)

  const classes = useStyles()

  if (editMode.mode === false) {
    // green('editMode', false)
    return (
      <div className={classes.notEditMode}>
        <div className={classes.notEditModeField}>{field}</div>
        <div className={classes.notEditModeField}>{operation}</div>
        <div className={classes.notEditModeField}>{value}</div>
        <Actions
          handleEditCriterionClick={handleEditCriterionClick}
          editMode={editMode}
          updateRule={_updateRule}
        />
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
          <Actions
            handleEditCriterionClick={handleEditCriterionClick}
            editMode={editMode}
            updateRule={_updateRule}
          />
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
