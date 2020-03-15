import React, { useState } from 'react'
import PropTypes from 'prop-types'
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
import isNilOrEmpty from 'lib/isNillOrEmpty'

const useStyles = makeStyles({
  tr: {
    backgroundColor: '#3a3a3a',
    width: '100%'
  },
  origDescriptionShow: props => ({
    display: props.showOrigDescription ? 'block' : 'none',
    color: 'rgb(175, 175, 175)'
  })
})

const TR = ({ doc, showOrigDescription, updateRulesAndData, view }) => {
  const {
    date,
    description,
    origDescription,
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

  const [_showRules, _setShowRules] = useState(false)
  const [_rowRuleIds, _setRowRuleIds] = useState(ruleIds || [])

  const _classes = useStyles({ showOrigDescription: showOrigDescription })

  const _handleRowClick = () => {
    _setShowRules(!_showRules)
  }

  const _handleAddRuleClick = async () => {
    // green('handleAddRuleClick')
    // const newRuleId = await newRule()
    const tmpId = `tmp_${shortid.generate()}`

    const newRuleIds = append(tmpId, _rowRuleIds)

    _setRowRuleIds(newRuleIds)
  }

  const Rules = () => {
    // green('Rules: showRules', showRules)
    // green('TR.Rules: rowRuleIds', rowRuleIds.length)
    if (_showRules === false) {
      return null
    }
    if (_rowRuleIds.length === 0) {
      // green('does not have ruleIds')
      return (
        <tr>
          <td colSpan="8">
            <button onClick={_handleAddRuleClick}>Add Rule</button>
          </td>
        </tr>
      )
    }
    return _rowRuleIds.map(id => (
      <tr key={id}>
        <td colSpan="8">
          <Rule ruleId={id} updateRulesAndData={updateRulesAndData} view={view} />
        </td>
      </tr>
    ))
  }

  return (
    <>
      <tr className={_classes.tr} onClick={_handleRowClick}>
        <TD align="left">{format(new Date(date), 'MM/dd/yyyy')}</TD>
        <TD align="left">
          <div>{description}</div>
          <div className={_classes.origDescriptionShow}>{origDescription}</div>
        </TD>
        <TD align="right">{credit}</TD>
        <TD align="right">{debit}</TD>
        <TD align="right">{category1}</TD>
        <TD align="right">{category2}</TD>
        <TD align="right">{type}</TD>
        <TD align="right">{omit}</TD>
        <TD align="center">
          {isNilOrEmpty(ruleIds) ? null : ruleIds.map(id => <div key={id}>{id}</div>)}
        </TD>
      </tr>
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

TR.propTypes = {
  doc: PropTypes.object.isRequired, 
  showOrigDescription: PropTypes.bool.isRequired,
  updateRulesAndData: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired
}