import React, { useCallback, useEffect, useState } from 'react'
import MuiTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import ColumnHeading from './ColumnHeading'
import {
  append,
  ascend,
  compose,
  descend,
  flip,
  has,
  map as rMap,
  mergeRight,
  prop,
  sortWith,
  // tap,
  toLower,
  transduce,
  type,
  mapObjIndexed
  // values
} from 'ramda'
import { sortDirections } from 'global-constants'
import shortid from 'shortid'

// eslint-disable-next-line
import { blue, green } from 'logger'

const _makeFormats = columns => {
  return columns
    .map(c => {
      if (has('formatFn')(c)) {
        return c.formatFn
      }
    })
    .filter(f => f !== undefined)
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
  const [_viewData, _setViewData] = useState([])
  const [_formats, _setFormats] = useState()

  const _modValues = (value, key, obj) => {
    // console.log('modValues', `${value}, ${key}, ${obj}`)
    green('_modValues: _formats', _formats)
    if (has(key)(_formats)) {
      return _formats[key](value)
    } else {
      return value
    }
  }
  const transform = compose(
    // tap(x => console.log('start', x)),
    rMap(mapObjIndexed(_modValues))
  )

  const _formatData = useCallback(data => {
    // rMap(mapIt, data)
    return transduce(transform, flip(append), [], data)
  }, [transform])

  // Effects
  // useEffect(() => {
  //   // green('seting formats')
  //   _setFormats(_makeFormats(columns))
  // }, [_setFormats, columns])

  // green('_formats', _formats)

  useEffect(() => {
    // green('setting _viewData START')
    const formats = _makeFormats(columns)
    _setFormats(formats)
    green('useEffect: formats', formats)
    _setViewData(_formatData(columns, data))
    // _setViewData(data)
    // green('setting _viewData END')
  }, [_setViewData, columns, data, _formatData])

  if (_viewData.length === 0) {
    return <h1>Loading</h1>
  }

  // Methods

  const _addSortField = field => data => {
    const sortFieldValue = prop(field, data)
    const y =
      type(sortFieldValue) === 'String'
        ? toLower(sortFieldValue)
        : sortFieldValue
    const withSortField = mergeRight(data, { sortField: y })
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
    )(_viewData)
  }

  const _updateSort = (fieldNames, direction) => {
    // currently all field names are an array but safe to check
    // green('_updateSort: fieldNames', fieldNames)
    // green('_updateSort: type fieldNames', type(fieldNames === 'Array'))
    _setSort({
      fieldNames: type(fieldNames === 'Array') ? fieldNames[0] : fieldNames,
      direction
    })
  }

  // const _cellTransforms = (vals, formatFn) => {
  //   if (type(vals) === 'Boolean') {
  //     return vals ? 'yes' : 'no'
  //   }
  //   if (formatFn) {
  //     return vals.map(v => formatFn(v))
  //   }
  //   return vals
  // }

  const _makeTableCellData = (column, rowData) => {
    const { fieldNames } = column
    const vals = fieldNames.map(f => rowData[f])
    if (vals.length === 1) {
      // return _cellTransforms(vals, formatFn)
      return vals
    } else {
      return vals.map((v, idx) => (
        <div
          key={shortid.generate()}
          style={idx === 0 ? { paddingBottom: 10 } : { paddingBottom: 0 }}
        >
          {/* {_cellTransforms(v, formatFn)} */}
          {v}
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
