import React, { useEffect /*, useState */ } from 'react'
// import { makeStyles } from '@material-ui/styles'
import MaterialTable from 'material-table'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { amountByCategoryReadRequest } from 'store/views/actions'
import { getAmountByCategory } from 'store/views/selectors'

// eslint-disable-next-line
import { green, red } from 'logger'

const AmountByCategoryReport = ({ data, amountByCategoryReadRequest }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await amountByCategoryReadRequest(('amount-by-category'))
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [amountByCategoryReadRequest])

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
  amountByCategoryReadRequest
}

const mapStateToProps = state => {
  return {
    data: getAmountByCategory(state)
  }
}

export default compose(connect(mapStateToProps, actions))(AmountByCategoryReport)
