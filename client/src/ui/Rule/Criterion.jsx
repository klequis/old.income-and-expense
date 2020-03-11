import React, { useState } from 'react'
import PropTypes, { string } from 'prop-types'
import Select from 'ui/elements/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/styles'
import { operators, dataFields } from 'global-constants'
import TextField from 'ui/elements/TextField'
// import { connect } from 'react-redux'
// import { compose } from 'recompose'
// import { getData } from 'store/data/selectors'

import RemoveIcon from '@material-ui/icons/Remove'
import CancelIcon from '@material-ui/icons/Cancel'
import DoneIcon from '@material-ui/icons/Done'
import IconButton from '@material-ui/core/IconButton'
import { mergeRight, startsWith } from 'ramda'
import { viewModes } from 'global-constants'

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
  viewModeField: {
    marginRight: 20
  }
})

const Criterion = ({ criterion, updateCriteria }) => {
  console.group('Criterion')
  green('criterion', criterion)
  green('updateCriteria', updateCriteria)
  console.groupEnd()
  
  // green('viewMode before', _viewMode)
  const { _id, field, operation, value } = criterion
  // const [_viewMode, _setViewMode] = useState(viewModes.modeView)
  const newMode = startsWith('tmp_', _id)
  green('newMode', newMode)
  const [_viewMode, _setViewMode] = useState(newMode ? viewModes.modeNew : viewModes.modeView)
  // _id =>
  //   startsWith('tmp_', _id) ? viewModes.modeNew : viewModes.modeView
  
  green('viewMode after', _viewMode)

  // TODO: you need useEffect to set use of viewMode on initial render.

  const [values, setValues] = useState({
    _id,
    field,
    operation,
    value
  })
  // green('Criterion: values', values)

  const DoneButton = () => (
    <IconButton onClick={handleDoneClick}>
      <DoneIcon />
    </IconButton>
  )

  const CancelButton = () => (
    <IconButton>
      <CancelIcon />
    </IconButton>
  )

  const RemoveButton = () => (
    <IconButton>
      <RemoveIcon />
    </IconButton>
  )

  const handleChange = event => {
    const { name, value } = event.target
    setValues(mergeRight(values, { [name]: value }))
  }

  const handleDoneClick = () => {
    green('handleDoneClick: values', values)
    green('viewModes.modeView', viewModes.modeView)
    // _setViewMode(viewModes.modeView)
    _setViewMode('modeView')
    updateCriteria(values)
  }

  const classes = useStyles()

  green('Criterion: _viewMode', _viewMode)

  if (_viewMode === viewModes.modeView) {
    green('Criterion - view mode')
    return (
      <div>
        <span className={classes.viewModeField}>{field}</span>
        <span className={classes.viewModeField}>{operation}</span>
        <span className={classes.viewModeField}>{value}</span>
      </div>
    )
  } else {
    green('Criterion - edit mode')
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
          <DoneButton onClick={handleDoneClick} />
          <CancelButton />
          <RemoveButton />
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

Criterion.propTypes = {
  criterion: PropTypes.shape({
    _id: string.isRequired,
    field: string.isRequired,
    operation: string.isRequired,
    value: string.isRequired
  }),
  updateCriteria: PropTypes.func.isRequired
}