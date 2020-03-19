import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import CriterionView from './CriterionView'
import CriterionEdit from './CriterionEdit'
import ActionView from './ActionView'
import ActionEdit from './ActionEdit'
import ActionButton from 'ui/elements/ActionButton'
import TestCriteriaResults from './TestCriteriaResults'
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

const Rule = ({ handleRuleDeleteClick, ruleId, removeRuleId }) => {
  // actions

  const {
    criteriaTestClear,
    ruleCreateRequest,
    ruleDeleteRequest,
    rulesReadRequest,
    ruleTmpAdd,
    ruleTmpRemove,
    ruleTmpUpdate,
    ruleUpdateRequest,
    viewReadRequest
  } = useFinanceContext()

  // local vars

  const _classes = useStyles()

  // state

  const [_rule, _setRule] = useState(
    useSelector(state => getRule(ruleId, state))
  )
  const [_viewMode, _setViewMode] = useState(
    isTmpRule(ruleId) ? viewModes.modeNew : viewModes.modeView
  )
  const [_dirty, _setDirty] = useState(false)

  const { criteria, actions } = _rule

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

  const _deleteClick = async () => {
    await ruleDeleteRequest(ruleId)
    await rulesReadRequest()
    await viewReadRequest()
    ruleTmpRemove(ruleId)
    removeRuleId(ruleId)
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

  const _dirtyChange = isDirty => {
    _setDirty(isDirty)
  }

  const _editClick = criterionId => {
    ruleTmpAdd(_rule)
    _setViewMode(viewModes.modeEdit)
  }

  const _saveClick = async () => {
    green('_saveClick: ruleId', ruleId)

    if (isTmpRule(ruleId)) {
      green('_saveClick: saving tmp rule')
      await ruleCreateRequest(ruleId, _rule)
    } else {
      green('_saveClick: saving existing rule')
      await ruleUpdateRequest(ruleId, _rule)
    }
    green('_saveClick: ruleTmpRemove')
    ruleTmpRemove(ruleId)
    green('_saveClick: setViewMode')
    _setViewMode(viewModes.modeView)
    green('_saveClick: read rules')
    await rulesReadRequest()
    green('_saveClick: read view')
    await viewReadRequest()
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
                onClick={handleRuleDeleteClick}
              />
            </>
          )}
        </div>

        {criteria.map(c => {
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
        {actions.map(a => {
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
        <TestCriteriaResults ruleId={ruleId} />
      </div>
    </div>
  )
}

export default Rule

Rule.propTypes = {
  ruleId: PropTypes.string.isRequired
}
