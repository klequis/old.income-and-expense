import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { compose } from 'recompose'
import { makeStyles } from '@material-ui/styles'
import TD from './TD'
import { format } from 'date-fns'
import Rule from 'ui/Rule'
import { append, without } from 'ramda'
import shortid from 'shortid'
import { ruleTmpAdd, ruleTmpRemove, ruleDeleteRequest, ruleUpdateRequest } from 'store/rules/actions'
import removeRule from 'lib/removeRule'
import isNilOrEmpty from 'lib/isNillOrEmpty'
import isTmpRule from 'lib/isTmpRule'


// eslint-disable-next-line
import { green, red } from 'logger'

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

const TR = ({
  doc,
  ruleTmpAdd,
  ruleDeleteRequest,
  ruleUpdateRequest,
  showOrigDescription,
  updateRulesAndData,
  view
}) => {
  const {
    category1,
    category2,
    credit,
    date,
    debit,
    description,
    omit,
    origDescription,
    ruleIds,
    type
  } = doc

  // console.group('TR')
  // green('doc', doc)
  // green('ruleIds', ruleIds)
  // console.groupEnd()

  const [_showRules, _setShowRules] = useState(false)
  const [_rowRuleIds, _setRowRuleIds] = useState(ruleIds || [])

  const _classes = useStyles({ showOrigDescription: showOrigDescription })

  const _handleRuleCancelClick = (ruleId) => {
    ruleTmpRemove(ruleId)
    if (isTmpRule(ruleId)) {
      const newRuleIds = without([ruleId], _rowRuleIds)
      _setRowRuleIds(newRuleIds)
      _setShowRules(false)
      // removeRule(ruleId)
    }
  }

  const _handleRowClick = () => {
    _setShowRules(!_showRules)
  }

  const _handleRuleAddClick = async () => {
    // green('handleAddRuleClick')
    // const newRuleId = await newRule()
    const tmpId = `tmp_${shortid.generate()}`

    const newRuleIds = append(tmpId, _rowRuleIds)
    ruleTmpAdd({
      _id: tmpId,
      criteria: [
        {
          _id: `tmp_${shortid.generate()}`,
          field: '',
          operation: '',
          value: ''
        }
      ],
      actions: [
        {
          _id: `tmp_${shortid.generate()}`
        }
      ]
    })

    _setRowRuleIds(newRuleIds)
  }

  const _handleRuleDeleteClick = async (ruleId) => {
    await ruleDeleteRequest(ruleId)
    await updateRulesAndData(view)
    ruleTmpRemove(ruleId)
  }

  const _saveRule = async (ruleId, ruleTmp) => {
    ruleTmpRemove(ruleId)
    if (isTmpRule(ruleId)) {
      red('TODO: tmp rule not implemented')
    } else {
      await ruleUpdateRequest(ruleId, ruleTmp)
      await updateRulesAndData(view)
      // await allDataByDescriptionRequest('all-data-by-description')
    }
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
            <button onClick={_handleRuleAddClick}>Add Rule</button>
          </td>
        </tr>
      )
    }
    return _rowRuleIds.map(id => (
      <tr key={id}>
        <td colSpan="8">
          <Rule
            ruleId={id}
            handleRuleCancelClick={_handleRuleCancelClick}
            handleRuleDeleteClick={_handleRuleDeleteClick}
            saveRule={_saveRule}
            updateRulesAndData={updateRulesAndData}
            view={view}
          />
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
          {isNilOrEmpty(ruleIds)
            ? null
            : ruleIds.map(id => <div key={id}>{id}</div>)}
        </TD>
      </tr>
      <Rules />
    </>
  )
}

const actions = {
  ruleTmpAdd,
  ruleDeleteRequest,
  ruleUpdateRequest,
  ruleTmpRemove
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, actions)(TR)

TR.propTypes = {
  doc: PropTypes.object.isRequired,
  showOrigDescription: PropTypes.bool.isRequired,
  updateRulesAndData: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  newRule: PropTypes.func.isRequired,
  ruleTmpAdd: PropTypes.func.isRequired,
  ruleDeleteRequest: PropTypes.func.isRequired,
  ruleUpdateRequest: PropTypes.func.isRequired
}
