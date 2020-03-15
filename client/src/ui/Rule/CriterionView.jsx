import React, { useState } from 'react'
import PropTypes, { string } from 'prop-types'
import { makeStyles } from '@material-ui/styles'

import TextField from 'ui/elements/TextField'
import { startsWith } from 'ramda'
import { viewModes } from 'global-constants'
import ActionButton from 'ui/elements/ActionButton'
import { buttonTypes } from 'ui/elements/ActionButton'

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

const CriterionView = ({ criterion, handleEditClick }) => {
  const { _id, field, operation, value } = criterion

  const _classes = useStyles()
  return (
    <div>
      <span className={_classes.viewModeField}>{field}</span>
      <span className={_classes.viewModeField}>{operation}</span>
      <span className={_classes.viewModeField}>{value}</span>
    </div>
  )
}

export default CriterionView

CriterionView.propTypes = {
  criterion: PropTypes.shape({
    _id: string.isRequired,
    field: string.isRequired,
    operation: string.isRequired,
    value: string.isRequired
  }),
  handleEditClick: PropTypes.func.isRequired
}
