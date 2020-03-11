import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { ruleTmpAdd, ruleTmpRemove, ruleTmpUpdate } from 'store/rules/actions'
import { makeStyles } from '@material-ui/styles'
import TD from './TD'
import { format } from 'date-fns'
import Rule from 'ui/Rule'
import { append, has } from 'ramda'
import { viewModes } from 'global-constants'

// eslint-disable-next-line
import { green } from 'logger'
import shortid from 'shortid'

const useStyles = makeStyles({
  tr: {
    backgroundColor: '#3a3a3a'
  }
})

const TR = ({ doc, newRule }) => {
  const {
    date,
    description,
    credit,
    debit,
    category1,
    category2,
    type,
    omit,
    ruleIds
  } = doc

  // console.group('TR')
  // green('doc', doc)
  // green('ruleIds', ruleIds)
  // console.groupEnd()

  const [showRules, setShowRules] = useState(false)
  const [rowRuleIds, setRowRuleIds] = useState(ruleIds)
  const classes = useStyles()

  const handleRowClick = () => {
    setShowRules(!showRules)
  }

  const handleAddRuleClick = async () => {
    // green('handleAddRuleClick')
    // const newRuleId = await newRule()
    const newRule = {
      _id: `tmp_${shortid.generate()}`,
      criteria: [],
      actions: []
    }

    const { _id } = newRule

    ruleTmpAdd(newRule)
    const newRuleIds = append(_id, rowRuleIds)

    console.group('handleAddRuleClick')
    green('newRule', newRule)
    green('_id', _id)
    green('rowRuleIds', rowRuleIds)
    green('newRuleIds', newRuleIds)
    console.groupEnd()

    setRowRuleIds(newRuleIds)

    green('*******************************************8')
    
  }

  const Rules = () => {
    if (showRules === false) {
      return null
    }
    if (!has('ruleIds')(doc)) {
      return (
        <tr>
          <td>
            <button onClick={handleAddRuleClick}>Add Rule</button>
          </td>
        </tr>
      )
    }
    return rowRuleIds.map(id => (
      <tr key={id}>
        <td>
          <Rule ruleId={id} />
        </td>
      </tr>
    ))
  }
  green('rowRuleIds', rowRuleIds)
  return (
    <>
      <tr className={classes.tr} onClick={handleRowClick}>
        <TD align="left">{format(new Date(date), 'MM/dd/yyyy')}</TD>
        <TD align="left">{description}</TD>
        <TD align="right">{credit}</TD>
        <TD align="right">{debit}</TD>
        <TD align="right">{category1}</TD>
        <TD align="right">{category2}</TD>
        <TD align="right">{type}</TD>
        <TD align="right">{omit}</TD>
      </tr>
      {/* {(showRules && ruleIds.length > 0) ? ruleIds.map(id => <tr><td><Rule rule={ruleIds[0]} /></td></tr> ) : null} */}
      {/* {has('ruleIds')(doc) ? <Rules /> : null} */}
      <Rules />
    </>
  )
}

export default TR
