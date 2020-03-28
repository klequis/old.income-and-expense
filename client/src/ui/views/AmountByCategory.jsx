import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import { makeStyles } from '@material-ui/styles'
import { useFinanceContext } from 'financeContext'
import { views } from 'global-constants'

// eslint-disable-next-line
import { green, red } from 'logger'

const AmountByCategory = () => {
  // Actions
  const { viewReadRequest, currentViewNameSet } = useFinanceContext()

  // State
  const [_loading, _setLoading] = useState(false)

  // Effects
  useEffect(() => {
    _setLoading(true)
    ;(async () => {
      await viewReadRequest(views.amountByCategory)
      currentViewNameSet(views.amountByCategory)
    })()
    _setLoading(false)
  }, [currentViewNameSet, viewReadRequest])

  // Local vars
  const _viewData = useSelector(state => state.viewData)
  green('_viewData', _viewData)

  if (_loading) {
    return <h1>Loading</h1>
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {_viewData.map(doc => {
            const { _id, amount } = doc
            return (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{amount}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default AmountByCategory
