import React, { useEffect /*, useState */ } from 'react'
// import { makeStyles } from '@material-ui/styles'
import MaterialTable from 'material-table'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { dataChangesReadRequest } from 'store/views/actions'
import { getDataChanges } from 'store/views/selectors'

// eslint-disable-next-line
import { green, red } from 'logger'

const ChangesByDataDocReport = ({ data, dataChangesReadRequest }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await dataChangesReadRequest('changes-by-data-doc')
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [dataChangesReadRequest])

  return (
    <MaterialTable
      columns={[
        { title: 'Date', field: 'date'},
        { title: 'Description', field: 'description' },
        { title: 'Original Description', field: 'origDescription' },
        { title: 'Category 1', field: 'category1' },
        { title: 'Category 2', field: 'category2' },

      ]}
      data={data}
      options={{ padding: 'dense' }}
    />
  )
}

const actions = {
  dataChangesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getDataChanges(state)
  }
}

export default compose(connect(mapStateToProps, actions))(
  ChangesByDataDocReport
)
