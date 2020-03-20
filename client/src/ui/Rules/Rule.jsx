import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import CriterionView from './CriterionView'
import CriterionEdit from './CriterionEdit'
import ActionView from './ActionView'
import ActionEdit from './ActionEdit'
import ActionButton from 'ui/elements/ActionButton'
import CriteriaTestResults from './CriteriaTestResults'
import { buttonTypes } from 'ui/elements/ActionButton'
import { viewModes } from 'global-constants'
import { findIndex, insert, mergeRight, prop, propEq, remove } from 'ramda'

import isTmpRule from 'lib/isTmpRule'
import { useFinanceContext } from 'financeContext'

// eslint-disable-next-line
import { green, yellow, red } from 'logger'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
    backgroundColor: 'red'
  },
  ruleId: {
    marginTop: 4,
    marginBottom: 4,
    fontWeight: 'bold'
  },
  actionButton: {
    marginRight: 30
  },
  actionsTitle: {
    fontWeight: 'bold',
    paddingTop: 16,
    paddingBottom: 4
  },
  ruleTitle: {
    display: 'flex',
    alignItems: 'center'
  }
})

const getRule = (ruleId, state) => {
  const rules = isTmpRule(ruleId) ? state.ruleTmp : state.rules
  const idx = findIndex(propEq('_id', ruleId))(rules)
  return rules[idx]
}

const Rule = ({ ruleId, removeRuleId, updateRulesAndView, }) => {

  // actions

  const {
    criteriaTestClear,
    criteriaTestReadRequest,
    ruleCreateRequest,
    ruleDeleteRequest,
    ruleTmpAdd,
    ruleTmpRemove,
    ruleTmpUpdate,
    ruleUpdateRequest,
  } = useFinanceContext()

  // state

  const [_rule, _setRule] = useState(
    useSelector(state => getRule(ruleId, state))
  )
  const [_viewMode, _setViewMode] = useState(
    isTmpRule(ruleId) ? viewModes.modeNew : viewModes.modeView
  )
  const [_dirty, _setDirty] = useState(false)
  
  // local vars

  const _ruleTmp = useSelector(state => getRule(ruleId, state))
  // green('Rule._ruleTmp', _ruleTmp)
  const _criteriaTestResults = useSelector(state => state.criteriaTestResults)
  // green('Rule: _criteriaTestResults', _criteriaTestResults)
  const _classes = useStyles()

  // methods

  const _actionChange = action => {
    const { actions } = _rule
    const actionId = prop('_id', action)
    const idx = findIndex(propEq('_id', actionId))(actions)
    const newActions =
      actions.length === 0 || idx === -1
        ? [action]
        : insert(idx, action, remove(idx, 1, actions))
    const newRule = mergeRight(_rule, { actions: newActions })
    _setRule(newRule)
    ruleTmpUpdate(newRule)
  }

  const _cancelClick = () => {
    ruleTmpRemove(ruleId)
    criteriaTestClear()
    if (isTmpRule(ruleId)) {
      removeRuleId(ruleId)
    }
    _setViewMode(viewModes.modeView)
  }

  const _criterionChange = criterion => {
    criteriaTestClear()
    const { criteria } = _rule

    const criterionId = prop('_id', criterion)
    const idx = findIndex(propEq('_id', criterionId))(criteria)

    const newCriteria =
      criteria.length === 0 || idx === -1
        ? [criterion]
        : insert(idx, criterion, remove(idx, 1, criteria))

    const newRule = mergeRight(_rule, { criteria: newCriteria })
    green('_criterionChange: newRule', newRule)
    _setRule(newRule)
    ruleTmpUpdate(newRule)
  }

  const _deleteClick = async () => {
    green('_deleteClick: ruleId', ruleId)
    await ruleDeleteRequest(ruleId)
    // await rulesReadRequest()
    // await viewReadRequest(_currentViewName)
    await updateRulesAndView()
    ruleTmpRemove(ruleId)
    removeRuleId(ruleId)
  }

  const _dirtyChange = isDirty => {
    _setDirty(isDirty)
  }

  const _editClick = criterionId => {
    ruleTmpAdd(_rule)
    _setViewMode(viewModes.modeEdit)
  }

  const _saveClick = async () => {
    

    if (isTmpRule(ruleId)) {
      green('_saveRule: ruleId', ruleId)  
      green('_saveRule: _rule', _rule)  
      await ruleCreateRequest(_rule)
    } else {
      green('_saveClick: saving existing rule')
      await ruleUpdateRequest(ruleId, _rule)
    }
    ruleTmpRemove(ruleId)
    _setViewMode(viewModes.modeView)
    // await rulesReadRequest()
    // await viewReadRequest(_currentViewName)
    await updateRulesAndView()
  }

  const _criteriaTestClick = async () => {
    const { criteria } = _ruleTmp
    await criteriaTestReadRequest(criteria)
  }

  // render

  return (
    <div key={ruleId} className={_classes.wrapper}>
      <div>
        <div className={_classes.ruleTitle}>
          <div className={_classes.ruleId}>RuleId: {ruleId}</div>
          {_viewMode === viewModes.modeView ? (
            <ActionButton buttonType={buttonTypes.edit} onClick={_editClick} />
          ) : (
            <>
              <ActionButton
                buttonType={buttonTypes.save}
                onClick={_saveClick}
                disabled={!_dirty}
              />
              <ActionButton
                buttonType={buttonTypes.cancel}
                onClick={_cancelClick}
              />
              <ActionButton
                buttonType={buttonTypes.delete}
                onClick={_deleteClick}
              />
            </>
          )}
        </div>

        {_rule.criteria.map(c => {
          const { _id } = c
          if (_viewMode === viewModes.modeView) {
            return (
              <CriterionView
                key={_id}
                criterion={c}
                handleEditClick={_editClick}
              />
            )
          }
          return (
            <CriterionEdit
              key={_id}
              criterion={c}
              handleDirtyChange={_dirtyChange}
              handleCriterionChange={_criterionChange}
            />
          )
        })}
        {_rule.actions.map(a => {
          const { _id } = a
          if (_viewMode === viewModes.modeView) {
            return <ActionView key={_id} action={a} />
          }
          return (
            <ActionEdit
              key={_id}
              action={a}
              handleDirtyChange={_dirtyChange}
              handleActionChange={_actionChange}
            />
          )
        })}
        <CriteriaTestResults
          data={_criteriaTestResults}
          criteriaTestClick={_criteriaTestClick}
        />
      </div>
    </div>
  )
}

export default Rule

Rule.propTypes = {
  ruleId: PropTypes.string.isRequired
}
