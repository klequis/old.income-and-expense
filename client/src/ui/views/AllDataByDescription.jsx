import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { getAllDataByDescription } from 'store/views/selectors'
import { allDataByDescriptionRequest } from 'store/views/actions'
import { rulesReadRequest, ruleCreateRequest } from 'store/rules/actions'
import TR from './TR'
import { makeStyles } from '@material-ui/styles'

// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles({
  tr: {
    backgroundColor: '#3a3a3a'
  }
})

const AllDataByDescription = ({
  allDataByDescriptionRequest,
  ruleCreateRequest,
  rulesReadRequest,
  data
}) => {
  useEffect(() => {
    ;(async () => {
      try {
        await rulesReadRequest()
        await allDataByDescriptionRequest('all-data-by-description')
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [allDataByDescriptionRequest, rulesReadRequest])

  const classes = useStyles()

  const newRule = async () => {
    const newRuleId = await ruleCreateRequest()
    green('AddDataByDescription.newRule: newRuleId', newRuleId)
  }

  return (
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
          return <TR newRule={newRule} key={_id} doc={doc} />
        })}
      </tbody>
    </table>
  )
}

const actions = {
  allDataByDescriptionRequest,
  ruleCreateRequest,
  rulesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getAllDataByDescription(state)
  }
}
export default compose(connect(mapStateToProps, actions))(AllDataByDescription)
