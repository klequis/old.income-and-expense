import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFinanceContext } from 'financeContext'
import { makeStyles } from '@material-ui/styles'
import { views } from 'global-constants'
// import { format } from 'date-fns'
import Table from './Table'
import { dataFields } from 'global-constants'
// import {
//   ascend,
//   compose,
//   descend,
//   map,
//   mergeRight,
//   prop,
//   sortWith,
//   toLower
// } from 'ramda'

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

  const _columns = [
    {
      fieldNames: [dataFields.date.name],
      fieldDescription: dataFields.date.description
    },
    {
      fieldNames: [
        dataFields.description.name,
        dataFields.origDescription.name
      ],
      fieldDescription: dataFields.description.description
    },
    {
      fieldNames: [dataFields.debit.name],
      fieldDescription: dataFields.debit.description
    },
    {
      fieldNames: [dataFields.credit.name],
      fieldDescription: dataFields.credit.description
    },
    {
      fieldNames: [dataFields.checkNumber.name],
      fieldDescription: dataFields.checkNumber.description
    },
    {
      fieldNames: [dataFields.category1.name],
      fieldDescription: dataFields.category1.description
    },
    {
      fieldNames: [dataFields.category2.name],
      fieldDescription: dataFields.category2.description
    },
    {
      fieldNames: [dataFields.type.name],
      fieldDescription: dataFields.type.description
    },
    {
      fieldNames: [dataFields.omit.name],
      fieldDescription: dataFields.omit.description
    },
    {
      fieldNames: [dataFields._id.name],
      fieldDescription: dataFields._id.description
    }
  ]

  // Methods
  return (
    <Table
      columns={_columns}
      data={_viewData}
      initialSortField={dataFields.description.name}
    ></Table>
  )
}

export default RawData
