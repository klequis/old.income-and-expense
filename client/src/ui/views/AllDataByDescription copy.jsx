import React, { useState, useEffect } from 'react'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TR from './TR'
import { useFinanceContext } from 'financeContext'

// eslint-disable-next-line
import { green, red } from 'logger'

const VIEW_NAME = 'all-data-by-description'

const AllDataByDescription = () => {
  const {
    viewData,
    viewReadRequest,
    ruleCreateRequest,
    rulesReadRequest
  } = useFinanceContext()

  const [_loading, _setLoading] = useState(false)
  const [_switchState, _setSwitchState] = useState({
    showOrigDescription: false
  })

  useEffect(() => {
    _setLoading(true)
    ;(async () => {
      await viewReadRequest(VIEW_NAME)
      await rulesReadRequest
    })()
    _setLoading(false)
    // eslint-disable-next-line
  }, [])

  if (_loading) {
    return <h1>Loading</h1>
  }
  const _handleSwitchChange = name => event => {
    _setSwitchState({ ..._switchState, [name]: event.target.checked })
  }

  const _newRule = async () => {
    const newRuleId = await ruleCreateRequest()
    green('TR._newRule: newRuleId', newRuleId)
  }

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={_switchState.showOrigDescription}
            onChange={_handleSwitchChange('showOrigDescription')}
            value="showOrigDesc"
          />
        }
        label="Show Original Description"
      />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Credit</th>
            <th>Debit</th>
            <th>Category 1</th>
            <th>Categoty 2</th>
            <th>Type</th>
            <th>Omit</th>
          </tr>
        </thead>
        <tbody>
          {viewData.map(doc => {
            const { _id } = doc
            return (
              <TR
                newRule={_newRule}
                key={_id}
                doc={doc}
                showOrigDescription={_switchState.showOrigDescription}
                view={VIEW_NAME}
              />
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default AllDataByDescription
