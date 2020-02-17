import React, { useEffect /*, useState */ } from 'react'
// import { makeStyles } from '@material-ui/styles'
import MaterialTable from 'material-table'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { categoryReportReadRequest } from 'store/categoryReport/actions'
import { getCategoryReportData } from 'store/categoryReport/selectors'

// eslint-disable-next-line
import { green, red } from 'logger'

const CategoryReport = ({ data, categoryReportReadRequest }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await categoryReportReadRequest()
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [categoryReportReadRequest])

  return (
    <MaterialTable
      columns={[
        { title: 'Category', field: '_id' },
        { title: 'Amount', field: 'amount' }
      ]}
      data={data}
      options={{ padding: 'dense' }}
    />
  )
}

const actions = {
  categoryReportReadRequest
}

const mapStateToProps = state => {
  return {
    data: getCategoryReportData(state)
  }
}

export default compose(connect(mapStateToProps, actions))(CategoryReport)
