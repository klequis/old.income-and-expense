import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import TD from './TD'
import { format } from 'date-fns'
import Rule from 'ui/Rule'
import { append } from 'ramda'
import { viewModes } from 'global-constants'

// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles({
  tr: {
    backgroundColor: '#3a3a3a'
  }
})

const TR = ({ doc }) => {
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
  const [showRules, setShowRules] = useState(false)
  const [rowRuleIds, setRowRuleIds] = useState(ruleIds || [])
  const classes = useStyles()
  // green('doc', doc)

  const handleRowClick = () => {
    // green('handleRowClick')
    setShowRules(!showRules)
  }

  const handleAddRuleClick = () => {
    // green('handleAddRuleClick')
    setRowRuleIds(append(viewModes.modeNew, rowRuleIds))
  }

  const Rules = () => {
    if (showRules === false) {
      return null
    }
    if (rowRuleIds.length === 0) {
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
  if (rowRuleIds.length > 0) {
    // green(`${doc._id}.rowRuleIds`, rowRuleIds)
  }

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
      <Rules />
    </>
  )
}

export default TR
