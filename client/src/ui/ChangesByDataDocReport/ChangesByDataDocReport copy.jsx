import React, { useEffect /*, useState */ } from 'react'
// import { makeStyles } from '@material-ui/styles'
import MaterialTable from 'material-table'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { changesByDataDocReadRequest } from 'store/reports/actions'
import { getChangesByDataDoc } from 'store/reports/selectors'

// eslint-disable-next-line
import { green, red } from 'logger'

const ChangesByDataDocReport = ({ data, changesByDataDocReadRequest }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await changesByDataDocReadRequest('changes-by-data-doc')
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [changesByDataDocReadRequest])

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
  changesByDataDocReadRequest
}

const mapStateToProps = state => {
  return {
    data: getChangesByDataDoc(state)
  }
}

export default compose(connect(mapStateToProps, actions))(
  ChangesByDataDocReport
)
