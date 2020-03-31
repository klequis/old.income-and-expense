import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFinanceContext } from 'financeContext'
import { makeStyles } from '@material-ui/styles'
import { views } from 'global-constants'
import { format } from 'date-fns'
import Table from './Table'
import { dataFieldNames, sortDirections } from 'global-constants'
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

const useStyles = makeStyles({
  tableDataPaper: {
    padding: 4
  }
})

const RawData = () => {
  // Actions
  const { viewReadRequest, currentViewNameSet } = useFinanceContext()
  const _classes = useStyles()

  // State
  const [_loading, _setLoading] = useState(false)
  // Effects
  useEffect(() => {
    _setLoading(true)
    ;(async () => {
      await viewReadRequest(views.rawData)
    })()
    _setLoading(false)
  }, [viewReadRequest])
  const _viewData = useSelector(state => state.viewData)

  if (_loading) {
    return <h1>Loading</h1>
  }
  green('RawData: _viewData', _viewData)

  const _columns = [
    { fieldNames: [dataFieldNames.date], fieldDescription: 'Date'},
    { fieldNames: [dataFieldNames.description, dataFieldNames.origDescription], fieldDescription: 'Description'},
    { fieldNames: [dataFieldNames.debit], fieldDescription: 'Debit'},
    { fieldNames: [dataFieldNames.credit], fieldDescription: 'Credit'},
    { fieldNames: [dataFieldNames.checkNumber], fieldDescription: 'Check#'},
    { fieldNames: [dataFieldNames.category1], fieldDescription: 'Category1'},
    { fieldNames: [dataFieldNames.category2], fieldDescription: 'Category2'},
    { fieldNames: [dataFieldNames.type], fieldDescription: 'Type'},
    { fieldNames: [dataFieldNames.omit], fieldDescription: 'Omit'},
    { fieldNames: [dataFieldNames._id], fieldDescription: '_id'},
  ]

  // Methods
  return (
    <Table columns={_columns} data={_viewData} initialSortField={dataFieldNames.description}></Table>
  )

}

export default RawData
