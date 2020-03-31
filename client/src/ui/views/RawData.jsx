import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useFinanceContext } from 'financeContext'
import { views } from 'global-constants'
import Table from './Table'
import { dataFields } from 'global-constants'

// eslint-disable-next-line
import { green } from 'logger'

const RawData = () => {
  // Actions
  const { viewReadRequest } = useFinanceContext()

  // Effects
  useEffect(() => {
    ;(async () => {
      
      await viewReadRequest(views.rawData)
      
    })()
  }, [viewReadRequest])
  const _viewData = useSelector(state => state.viewData)
  
  if (_viewData.length === 0) {
    return <h1>Loading</h1>
  }

  const _columns = [
    {
      fieldNames: [dataFields.date.name],
      fieldDescription: dataFields.date.description,
      formatFn: dataFields.date.formatFn
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
      fieldDescription: dataFields.omit.description,
      formatFn: dataFields.omit.formatFn
    },
    {
      fieldNames: [dataFields._id.name],
      fieldDescription: dataFields._id.description
    }
  ]

  // Methods
  return (
    // <h1>hi</h1>
    <Table
      columns={_columns}
      data={_viewData}
      initialSortField={dataFields.debit.name}
    />
  )
}

export default RawData
