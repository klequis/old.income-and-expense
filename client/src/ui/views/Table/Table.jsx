import React, { useEffect, useState } from 'react'
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
  has,
  map as rMap,
  mergeRight,
  prop,
  sortWith,
  toLower,
  type,
  mapObjIndexed
  // has
  // values
} from 'ramda'
import { sortDirections } from 'global-constants'
import shortid from 'shortid'

// eslint-disable-next-line
import { blue, green } from 'logger'

const formats = {
  omit: d => d ? 'yes' : 'no',
  // date: d => format(new Date(d), 'MM/dd/yyyy')
  date: d => `++${d}`
}


const modValues = (value, key, obj)  => {
  if (has(key)(formats)) {
    // console.log(`${key} has a format function`)
    return formats[key](value)
  } else {
    // console.log(`${key} DOES NOT HAVE format function`)
    return value
  }
}


const mapIt = m => R.mapObjIndexed(modValues, m)

const _formatData = (columns, data) => {
  rMap(mapIt, data)
}

const Table = ({ data, columns, initialSortField }) => {
  // TODO: 'data' should have column.formatFn applied here
  // TODO:   and not in cellTransform as as it runs on every render
  // TODO:   e.g., when sorting.
  // TODO:   The same is true for checking for boolean. If fact, the
  // TODO:   transform from 'boolean' to yes/no could be specified
  // TODO:   in the columns formatFn property

  // State
  const [_sort, _setSort] = useState({
    fieldNames: initialSortField,
    direction: sortDirections.ascending
  })

  const [_viewData, _setViewData] = useState()


  // Effects
  useEffect(() => {
    _setViewData(_formatData(data))
  })


  // Methods
  const _addSortField = field => data => {
    // green('addSortField: field', field)
    // green('addSortField: data', data)
    const sortFieldValue = prop(field, data)
    const y =
      type(sortFieldValue) === 'String'
        ? toLower(sortFieldValue)
        : sortFieldValue

    // green('addSortField: y', y)
    const withSortField = mergeRight(data, { sortField: y })
    // green('addSortField: withSortField', withSortField)
    return withSortField
  }

  const _getViewData = () => {
    const { direction, fieldNames: fieldName } = _sort

    return compose(
      sortWith(
        direction === 'ascending'
          ? [ascend(prop('sortField'))]
          : [descend(prop('sortField'))]
      ),
      rMap(_addSortField(fieldName))
    )(data)
  }

  const _updateSort = (fieldNames, direction) => {
    // currently all field names are an array but safe to check
    green('_updateSort: fieldNames', fieldNames)
    green('_updateSort: type fieldNames', type(fieldNames === 'Array'))
    _setSort({
      fieldNames: type(fieldNames === 'Array') ? fieldNames[0] : fieldNames,
      direction
    })
  }

  const _cellTransforms = (vals, formatFn) => {
    // green('cellTransforms: val', val)
    if (type(vals) === 'Boolean') {
      return vals ? 'yes' : 'no'
    }
    // if (has('formatFn')(vals)) {
    //   green('it has one')
    // }
    if (formatFn) {
      // green('it has one of type', typeof formatFn)
      return vals.map(v => formatFn(v))
    }
    return vals
  }

  // const cellTransforms1 = (value, formatFn) => {

  // }

  const _makeTableCellData = (column, rowData) => {
    // green('makeTableCellData: rowData', rowData)
    // green('makeTableCellData: column', column)

    const { fieldNames, formatFn } = column

    const vals = fieldNames.map(f => rowData[f])

    // green('has', has('formatFn')(column))

    if (vals.length === 1) {
      return _cellTransforms(vals, formatFn)
    } else {
      return vals.map((v, idx) => (
        <div
          key={shortid.generate()}
          style={idx === 0 ? { paddingBottom: 10 } : { paddingBottom: 0 }}
        >
          {_cellTransforms(v, formatFn)}
        </div>
      ))
    }
  }

  const Row = ({ rowData }) => {
    return (
      <TableRow>
        {columns.map(c => {
          return (
            <TableCell key={c.fieldNames[0]}>
              {_makeTableCellData(c, rowData)}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }

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
          {_getViewData().map(d => (
            <Row key={d._id} rowData={d} />
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

export default Table
