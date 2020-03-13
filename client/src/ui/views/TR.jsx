import React, { useState } from 'react'
// import { connect } from 'react-redux'
// import { compose } from 'recompose'
import { makeStyles } from '@material-ui/styles'
import TD from './TD'
import { format } from 'date-fns'
import Rule from 'ui/Rule'
import { append } from 'ramda'
import shortid from 'shortid'

// eslint-disable-next-line
import { green, red } from 'logger'


const useStyles = makeStyles({
  tr: {
    backgroundColor: '#3a3a3a',
    width: '100%'
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

  
  // console.group('TR')
  // green('doc', doc)
  // green('ruleIds', ruleIds)
  // console.groupEnd()

  const [showRules, setShowRules] = useState(false)
  const [rowRuleIds, setRowRuleIds] = useState(ruleIds || [])
  const classes = useStyles()

  const handleRowClick = () => {
    setShowRules(!showRules)
  }

  const handleAddRuleClick = async () => {
    // green('handleAddRuleClick')
    // const newRuleId = await newRule()
    const tmpId = `tmp_${shortid.generate()}`


    const newRuleIds = append(tmpId, rowRuleIds)

    setRowRuleIds(newRuleIds)

  }

  const Rules = () => {
    // green('Rules: showRules', showRules)
    // green('TR.Rules: rowRuleIds', rowRuleIds.length)
    if (showRules === false) {
      return null
    }
    if (rowRuleIds.length === 0) {
      // green('does not have ruleIds')
      return (
        <tr>
          <td colSpan='8'>
            <button onClick={handleAddRuleClick}>Add Rule</button>
          </td>
        </tr>
      )
    }
    return rowRuleIds.map(id => (
      <tr key={id}>
        <td colSpan='8'>
          <Rule ruleId={id} />
        </td>
      </tr>
    ))
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
      {/* {has('ruleIds')(doc) ? <Rules /> : null} */}
      <Rules />
    </>
  )
}

// const actions = {
//   ruleTmpAdd,
//   ruleTmpRemove,
//   ruleTmpUpdate
// }

// const mapStateToProps = state => ({})

// export default connect(mapStateToProps, actions)(TR)
export default TR
