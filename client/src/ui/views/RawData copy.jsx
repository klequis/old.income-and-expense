import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFinanceContext } from 'financeContext'
import { makeStyles } from '@material-ui/styles'
import { views } from 'global-constants'
import { format } from 'date-fns'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { dataFields, sortDirections } from 'global-constants'
import ColumnHeading from './Table/ColumnHeading'
import {
  ascend,
  compose,
  descend,
  map,
  mergeRight,
  prop,
  sortWith,
  toLower
} from 'ramda'

// eslint-disable-next-line
import { green } from 'logger'

const noWrapStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
}

const useStyles = makeStyles({
  tableDataPaper: {
    padding: 4
  }
})

const Row = ({ data }) => {
  const {
    _id,
    date,
    description,
    origDescription,
    debit,
    credit,
    type,
    checkNumber,
    omit,
    category1,
    category2
  } = data
  return (
    <TableRow>
      <TableCell>{format(new Date(date), 'MM/dd/yyyy')}</TableCell>
      <TableCell>
        <div>{description}</div>
        <div>{origDescription}</div>
      </TableCell>
      <TableCell>{debit}</TableCell>
      <TableCell>{credit}</TableCell>
      <TableCell>{checkNumber}</TableCell>
      <TableCell>
        <div>{category1}</div>
      </TableCell>
      <TableCell>
        <div>{category2}</div>
      </TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>{omit ? 'yes' : ''}</TableCell>
      <TableCell>{_id}</TableCell>
    </TableRow>
  )
}

const RawData = () => {
  // Actions
  const { viewReadRequest, currentViewNameSet } = useFinanceContext()
  const _classes = useStyles()

  // State
  const [_sort, _setSort] = useState({
    fieldName: dataFields.description.name,
    direction: sortDirections.ascending
  })

  // Effects
  useEffect(() => {
    ;(async () => {
      await viewReadRequest(views.rawData)
    })()
  }, [viewReadRequest])
  const _viewData = useSelector(state => state.viewData)

  // Methods

  // const getViewData = () => {
  //   const { direction, fieldName } = _sort
  //   if (direction === sortDirections.ascending) {

  //     return sortWith([ascend(prop(fieldName))])(_viewData)

  //   }
  //   return sortWith([descend(prop(fieldName))])(_viewData)
  // }

  const addSortField = field => data => {
    const y = toLower(prop(field, data))
    return mergeRight(data, { sortField: y })
  }

  /*
    restoreField() won't work bec the orig field value is gone
    1. add new field that isn't displayed
    2. sort on the new field

  */

  const getViewData = () => {
    const { direction, fieldName } = _sort
    return compose(
      sortWith(
        direction === 'ascending'
          ? [ascend(prop('sortField'))]
          : [descend(prop('sortField'))]
      ),
      map(addSortField(fieldName))
    )(_viewData)
  }

  const _updateSort = (fieldName, direction) => {
    _setSort({
      fieldName,
      direction
    })
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <ColumnHeading fieldName="date" updateSort={_updateSort}>
              Date
            </ColumnHeading>
            <ColumnHeading fieldName="description" updateSort={_updateSort}>
              Description
            </ColumnHeading>
            <ColumnHeading fieldName="debit" updateSort={_updateSort}>
              Debit
            </ColumnHeading>
            <ColumnHeading fieldName="credit" updateSort={_updateSort}>
              Credit
            </ColumnHeading>
            <ColumnHeading fieldName="checkNumber" updateSort={_updateSort}>
              Check#
            </ColumnHeading>
            <ColumnHeading fieldName="category1" updateSort={_updateSort}>
              Category1
            </ColumnHeading>
            <ColumnHeading fieldName="category2" updateSort={_updateSort}>
              Category2
            </ColumnHeading>
            <ColumnHeading fieldName="type" updateSort={_updateSort}>
              Type
            </ColumnHeading>
            <ColumnHeading fieldName="omit" updateSort={_updateSort}>
              Omit
            </ColumnHeading>
            <ColumnHeading fieldName="_id" updateSort={_updateSort}>
              _id
            </ColumnHeading>
          </TableRow>
        </TableHead>
        <TableBody>
          {getViewData().map(data => (
            <Row key={data._id} data={data} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RawData
