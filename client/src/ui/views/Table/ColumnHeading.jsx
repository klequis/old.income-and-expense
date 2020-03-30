import React from 'react'
import { makeStyles } from '@material-ui/styles'
import SortButtons from 'ui/elements/SortButtons'
import TableCell from '@material-ui/core/TableCell'
// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles({
  th: {
    display: 'flex',
    flexFlow: 'row nowrap',
    paddingBottom: 5
  },
  thText: {
    marginRight: 10,
    whiteSpace: 'nowrap',
    textTransform: 'capitalize'
  }
})

const ColumnHeading = ({ fieldName, updateSort, children }) => {
  const _fieldName = fieldName[0]
  const _classes = useStyles()
  return (
    <TableCell>
      <div className={_classes.th}>
        <span className={_classes.thText}>{children}</span>
        <SortButtons updateSort={updateSort} fieldName={_fieldName} />
      </div>
    </TableCell>
  )
}

export default ColumnHeading