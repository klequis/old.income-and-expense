import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getAllDataByDescription } from 'store/views/selectors'
import { viewReadRequest } from 'store/views/actions'
import { rulesReadRequest, ruleCreateRequest } from 'store/rules/actions'
import TR from './TR'
import { makeStyles } from '@material-ui/styles'
import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// eslint-disable-next-line
import { green, red } from 'logger'

const useStyles = makeStyles({
  tr: {
    backgroundColor: '#3a3a3a'
  }
})

const AllDataByDescription = ({
  updateRulesAndData,
  viewReadRequest,
  ruleCreateRequest,
  rulesReadRequest,
  data,
  
}) => {

  const [_switchState, _setSwitchState] = useState({
    showOrigDescription: false
  })

  green('updateRulesAndData', updateRulesAndData)

  useEffect(() => {
    ;(async () => {
      await updateRulesAndData('all-data-by-description')
    })()
  }, [])

  const _classes = useStyles()

  const newRule = async () => {
    const newRuleId = await ruleCreateRequest()
    green('AddDataByDescription.newRule: newRuleId', newRuleId)
  }

  const _handleSwitchChange = name => event => {
    _setSwitchState({ ..._switchState, [name]: event.target.checked })
  }


  return (
    <div>
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
          {data.map(doc => {
            const { _id } = doc
            return (
              <TR
                newRule={newRule}
                key={_id}
                doc={doc}
                updateRulesAndData={updateRulesAndData}
                showOrigDescription={_switchState.showOrigDescription}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const actions = {
  // viewReadRequest,
  ruleCreateRequest,
  // rulesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getAllDataByDescription(state)
  }
}
export default compose(connect(mapStateToProps, actions))(AllDataByDescription)

AllDataByDescription.propTypes = {
  // viewReadRequest: PropTypes.func.isRequired,
  ruleCreateRequest: PropTypes.func.isRequired,
  // rulesReadRequest: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateRulesAndData: PropTypes.func.isRequired,
}
