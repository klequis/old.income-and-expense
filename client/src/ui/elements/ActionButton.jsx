import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import CancelIcon from '@material-ui/icons/Cancel'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Save'

// eslint-disable-next-line
import { green, red } from 'logger'

export const buttonTypes = {
  add: 'addButton',
  cancel: 'cancelButton',
  delete: 'deleteButton',
  edit: 'editButton',
  save: 'saveButton'
}

const Icon = ({buttonType}) => {
  
  switch (buttonType) {
    case buttonTypes.add:
      return <AddIcon />
    case buttonTypes.cancel:
      return <CancelIcon />
    case buttonTypes.delete:
      return <DeleteForeverIcon />
    case buttonTypes.edit:
      return <EditIcon />
    case buttonTypes.save:
      return <SaveIcon />
    default:
      throw new Error(
        `ActionButton.Icon ERROR: unknown buttonType ${buttonType}`
      )
  }
}

const ActionButton = ({ buttonType, onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <Icon buttonType={buttonType} />
    </IconButton>
  )
}

export default ActionButton
