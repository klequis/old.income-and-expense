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
import shortid from 'shortid'

// eslint-disable-next-line
import { green } from 'logger'

const Table = ({ data, columns, initialSortField }) => {
  // State
  const [_sort, _setSort] = useState({
      fieldNames: initialSortField,
      direction: sortDirections.ascending
  })

  // Methods
  const addSortField = field => data => {
    const y = toLower(prop(field, data))
    return mergeRight(data, { sortField: y })
  }

  const getViewData = () => {
    const { direction, fieldNames: fieldName } = _sort
    return compose(
      sortWith(
        direction === 'ascending'
          ? [ascend(prop('sortField'))]
          : [descend(prop('sortField'))]
      ),
      rMap(addSortField(fieldName))
    )(data)
  }

  const _updateSort = (fieldNames, direction) => {
    // currently all field names are an array but safe to check
    _setSort({
      fieldNames: type(fieldNames === 'Array') ? fieldNames[0] : fieldNames,
      direction
    })
  }

  const boolToString = val => {
    if (type(val) === 'Boolean') {
      return val ? 'yes' : 'no'
    }
    return val
  }

  const makeTableCellData = vals => {
    // green('vals', vals)

    if (vals.length === 1) {
      return boolToString(vals[0])
    } else {
      return vals.map((v, idx) => (
        <div
          key={shortid.generate()}
          style={idx === 0 ? { paddingBottom: 10 } : { paddingBottom: 0 }}
        >
          {boolToString(v)}
        </div>
      ))
    }
  }

  const Row = ({ rowData }) => {
    return (
      <TableRow>
        {columns.map(c => {
          const { fieldNames } = c
          const vals = fieldNames.map(f => rowData[f])
          return (
            <TableCell key={fieldNames[0]}>{makeTableCellData(vals)}</TableCell>
          )
        })}
      </TableRow>
    )
  }
  green('_sort', _sort)
  return (
    <TableContainer>
      <MuiTable size="small">
        <TableHead>
          <TableRow>
            {columns.map(c => (
              <ColumnHeading
                key={c.fieldNames[0]}
                fieldName={c.fieldNames}
                updateSort={_updateSort}
              >
                {c.fieldDescription}
              </ColumnHeading>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {getViewData().map(d => (
            <Row key={d._id} rowData={d} />
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

export default Table
