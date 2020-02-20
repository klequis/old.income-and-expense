import React from 'react'
import MuiSelect from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/styles'
// eslint-disable-next-line
import { green, redf } from 'logger'

const useStyles = makeStyles({
  root: {
    fontSize: 14,
    // color: 'green'
  }
})

const Select = ({ name, value, onChange, children }) => {
  const classes = useStyles()
  return (
    <MuiSelect
      name={name}
      value={value}
      onChange={onChange}
      classes={{
        root: classes.root,
      }}
    >
      {children}
    </MuiSelect>
  )
}

export default Select
