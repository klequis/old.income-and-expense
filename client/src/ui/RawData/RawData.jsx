import React, { useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getData } from 'store/data/selectors'
import { dataReadRequest } from 'store/data/actions'
import { mergeRight, sortBy, prop } from 'ramda'
import { format } from 'date-fns'
import ChevronRight from '@material-ui/icons/ChevronRight'
import { yellow } from 'logger'

const noWrapStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
}

const sortByDate = sortBy(prop('date'))

const RawData = ({ dataReadRequest, data, description, showOrigDesc }) => {
  const [showOmitted, setShowOmitted] = useState(false)
  useEffect(() => {
    ;(async () => {
      try {
        await dataReadRequest(description, showOmitted)
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [dataReadRequest, description, showOmitted])
  const sorted = sortByDate(data)
  
  
  return (
    <MaterialTable
      columns={[
        { title: 'AcctID', field: 'acctId' },
        { title: 'Date', field: 'date', type: 'date' },
        {
          title: 'Description',
          field: 'description',
          cellStyle: noWrapStyle
        },
        { title: 'Credit', field: 'credit', type: 'currency' },
        { title: 'Debit', field: 'debit', type: 'currency' },
        { title: 'Category1', field: 'category1', cellStyle: noWrapStyle },
        { title: 'Category2', field: 'category2', cellStyle: noWrapStyle },
        { title: 'Omit', field: 'Omit' }
      ]}
      data={sorted.map(doc =>
        mergeRight(doc, { date: format(new Date(doc.date), 'MM/dd/yyyy') })
      )}
      title="Chase Data"
      options={{ pageSize: 1000, padding: 'dense' }}
      detailPanel={rowData => {
        return <div style={{ paddingLeft: 30 }}>{rowData.origDescription}</div>
      }}
      icons={{ DetailPanel: ChevronRight }}
    />
  )
}

const actions = {
  dataReadRequest
}

const mapStateToProps = state => {
  return {
    data: getData(state)
  }
}

export default compose(connect(mapStateToProps, actions))(RawData)

