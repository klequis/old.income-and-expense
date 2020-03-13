import React from 'react'
import PropTypes from 'prop-types'
import ActionButton from 'ui/elements/ActionButton'
import { buttonTypes } from 'ui/elements/ActionButton'
import { viewModes } from 'global-constants'

const RuleActionButtons = ({
  handleCancelClick,
  handleDeleteClick,
  handleEditclick,
  handleSaveClick,
  viewMode
}) => {
  if (viewMode === viewModes.modeEdit) {
    return (
      <>
        <ActionButton
          buttonType={buttonTypes.save}
          onClick={handleSaveClick}
        />
        <ActionButton
          buttonType={buttonTypes.cancel}
          onClick={handleCancelClick}
        />
        <ActionButton
          buttonType={buttonTypes.delete}
          onClick={handleDeleteClick}
        />
      </>
    )
  }
  if (viewMode === viewModes.modeNew) {
    return (
      <>
        <ActionButton
          buttonType={buttonTypes.save}
          onClick={handleSaveClick}
        />
        <ActionButton
          buttonType={buttonTypes.cancel}
          onClick={handleCancelClick}
        />
      </>
    )
  }
  return (
    <ActionButton buttonType={buttonTypes.edit} onClick={handleEditclick} />
  )
}

export default RuleActionButtons