import React, { useState } from 'react'
import MuiTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import ColumnHeading from './ColumnHeading'
import {
  ascend,
  compose,
  descend,
  map as rMap,
  mergeRight,
  prop,
  sortWith,
  toLower,
  type
  // values
} from 'ramda'
import { sortDirections } from 'global-constants'

// eslint-disable-next-line
import { green } from 'logger'

const Table = ({ data, columns, initialSortField }) => {
  green('Table: data', data)

  const [_sort, _setSort] = useState({
    fieldName: initialSortField,
    direction: sortDirections.ascending
  })

  const addSortField = field => data => {
    const y = toLower(prop(field, data))
    return mergeRight(data, { sortField: y })
  }

  const getViewData = () => {
    const { direction, fieldName } = _sort
    green('getViewData: direction', direction)
    green('getViewData: fieldName', fieldName)
    return compose(
      sortWith(
        direction === 'ascending'
          ? [ascend(prop('sortField'))]
          : [descend(prop('sortField'))]
      ),
      rMap(addSortField(fieldName))
    )(data)
  }

  const _updateSort = (fieldName, direction) => {
    _setSort({
      fieldName,
      direction
    })
  }

  // A Row has a collection of Cells

  // const Row = items => {
  //   green('Row: items', items)
  //   return <MuiTableRow>{items}</MuiTableRow>
  // }
  // const Cell = value => {
  //   green('Cell: value', value)
  //   // green('Cell: values', values(value))
  //   return <TableCell>{value}</TableCell>
  // }

  // // const printData = data => green('printData', data)

  // const TableRows = ({ allData }) => {
  //   // green('TableRow: rowData', rowData)
  //   return compose(Row, map(Cell), map(values))(allData)
  // }

  const makeTableCellData = vals => {
    // green('vals', vals)

    if (vals.length === 1) {
      return vals[0]
    } else {
      return vals.map((v, idx) => (
        <div style={idx === 0 ? { paddingBottom: 10 } : { paddingBottom: 0 }}>
          {v}
        </div>
      ))
    }

    // if (type(vals) === 'Array') {
    //   return vals.map(v => <div>{v}</div>)
    // } else if(type(vals) === 'Boolean') {
    //   return vals ? 'yes' : 'no'
    // }
    // return vals
  }

  const Row = ({ rowData }) => {
    // green('values(rowData)', values(rowData))
    // const rowValues = values(rowData)
    // green('rowData', rowData)
    return (
      <TableRow>
        {columns.map(c => {
          const { fieldNames } = c
          const vals = fieldNames.map(f => rowData[f])
          return <TableCell>{makeTableCellData(vals)}</TableCell>
        })}
      </TableRow>
    )
  }

  // While 

  return (
    <TableContainer>
      <MuiTable size="small">
        <TableHead>
          {columns.map(c => (
            <ColumnHeading fieldName={c.fieldNames} updateSort={_updateSort}>
              {c.fieldDescription}
            </ColumnHeading>
          ))}
        </TableHead>
        <TableBody>
          {getViewData().map(d => (
            <Row key={data._id} rowData={d} />
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

export default Table
