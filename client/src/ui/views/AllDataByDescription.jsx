import React, { useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TR from './TR'
import { useFinanceContext } from 'financeContext'

// eslint-disable-next-line
import { green, red } from 'logger'

const VIEW_NAME = 'all-data-by-description'

const AllDataByDescription = () => {
  const {
    rulesReadRequest,
    viewReadRequest,
    currentViewNameSet
  } = useFinanceContext()

  const [_loading, _setLoading] = useState(false)
  const [_switchState, _setSwitchState] = useState({
    showOrigDescription: false,
    showOmitted: false
  })

  const _updateRulesAndView = useCallback(async () => {
    await rulesReadRequest()
    await viewReadRequest(VIEW_NAME)
  }, [rulesReadRequest, viewReadRequest])

  useEffect(() => {
    _setLoading(true)
    ;(async () => {
      // await rulesReadRequest()
      // await viewReadRequest(VIEW_NAME)
      await _updateRulesAndView()
      currentViewNameSet(VIEW_NAME)
    })()
    _setLoading(false)
    // // eslint-disable-next-line
  }, [currentViewNameSet, _updateRulesAndView])

  const _viewData = useSelector(state => state.viewData)
  // green('3. AllDataByDescription: _viewData', _viewData.length)

  if (_loading) {
    return <h1>Loading</h1>
  }

  const _handleSwitchChange = name => event => {
    _setSwitchState({ ..._switchState, [name]: event.target.checked })
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
      <FormControlLabel
        control={
          <Switch
            checked={_switchState.showOmitted}
            onChange={_handleSwitchChange('showOmitted')}
            value="showOmitted"
          />
        }
        label="Show Omitted"
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
          {_viewData.map(doc => {
            const { _id, omit } = doc
            if (_switchState.showOmitted === false && omit) {
              return null
            }
            return (
              <TR
                key={_id}
                doc={doc}
                showOrigDescription={_switchState.showOrigDescription}
                showOmitted={_switchState.showOmitted}
                updateRulesAndView={_updateRulesAndView}
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
