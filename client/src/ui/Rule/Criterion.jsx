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
import { mergeRight, startsWith } from 'ramda'
import { viewModes } from 'global-constants'
import ActionButton from 'ui/elements/ActionButton'


// import RemoveIcon from '@material-ui/icons/Remove'
// import CancelIcon from '@material-ui/icons/Cancel'
// import DoneIcon from '@material-ui/icons/Done'
// import IconButton from '@material-ui/core/IconButton'

// eslint-disable-next-line
import { green, redf } from 'logger'
import { buttonTypes } from 'ui/elements/ActionButton'

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

  const _handleChange = event => {
    const { name, value } = event.target
    setValues(mergeRight(values, { [name]: value }))
  }

  const _handleCancelClick = () => {
    // TODO: implement
    green('_handleCancelClick')
  }
  const _handleDoneClick = () => {
    green('handleDoneClick: values', values)
    green('viewModes.modeView', viewModes.modeView)
    // _setViewMode(viewModes.modeView)
    _setViewMode('modeView')
    updateCriteria(values)
  }

  const _handleEditClick = () => {
    green('_handleEditClick')
    _setViewMode(viewModes.modeEdit)
  }



  const CriterionActionButtons = () => {
    if (_viewMode === viewModes.modeView) {
      return (
        <ActionButton buttonType={buttonTypes.edit} onClick={_handleEditClick} />
      )
    }
    return (
      <>
        <ActionButton buttonType={buttonTypes.done} onClick={_handleDoneClick} />
        <ActionButton buttonType={buttonTypes.cancel} onClick={_handleCancelClick} />
      </>
    )
    // if (viewMode === viewModes.modeEdit) {
      
    // }
    
  }

  const _classes = useStyles()

  green('Criterion: _viewMode', _viewMode)

  if (_viewMode === viewModes.modeView) {
    green('Criterion - view mode')
    return (
      <div>
        <span className={_classes.viewModeField}>{field}</span>
        <span className={_classes.viewModeField}>{operation}</span>
        <span className={_classes.viewModeField}>{value}</span>
        <CriterionActionButtons />
      </div>
    )
  } else {
    green('Criterion - edit mode')
    return (
      <div className={_classes.wrapper}>
        <div /*className={classes.fields}*/>
          <Select
            className={_classes.field}
            name="field"
            value={values.field}
            onChange={_handleChange}
          >
            <MenuItem value={dataFields.description}>Description</MenuItem>
            <MenuItem value={dataFields.typeOrig}>Type</MenuItem>
          </Select>

          <Select
            className={_classes.field}
            name="operation"
            value={values.operation}
            onChange={_handleChange}
          >
            <MenuItem value={operators.beginsWith}>Begins With</MenuItem>
            <MenuItem value={operators.contains}>Contains</MenuItem>
            <MenuItem value={operators.equals}>Equals</MenuItem>
            <MenuItem value={operators.regex}>RegEx</MenuItem>
            <MenuItem value={operators.in}>In</MenuItem>
          </Select>
          <TextField
            className={_classes.field}
            name="value"
            label="value"
            value={values.value}
            onChange={_handleChange}
            fullWidth
          />
        </div>
        <CriterionActionButtons />
        {/* <div className={classes.actions}>
          <DoneButton onClick={handleDoneClick} />
          <CancelButton />
          <RemoveButton />
        </div> */}
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