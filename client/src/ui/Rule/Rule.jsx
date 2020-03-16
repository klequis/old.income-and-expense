import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getRuleById } from 'store/rules/selectors'
import {
  ruleTmpAdd,
  ruleTmpRemove,
  ruleTmpUpdate,
  ruleUpdateRequest
} from 'store/rules/actions'
import {
  criteriaTestReadRequest,
  criteriaTestClear
} from 'store/criteriaTest/actions'
import { getCriteriaTestResults } from 'store/criteriaTest/selectors'
import { areRequestsPending } from 'store/requests/selectors'
import { makeStyles } from '@material-ui/styles'
import CriterionView from './CriterionView'
import CriterionEdit from './CriterionEdit'
import ActionView from './ActionView'
import ActionEdit from './ActionEdit'
import ActionButton from 'ui/elements/ActionButton'
import TestCriteriaResults from './TestCriteriaResults'
import { buttonTypes } from 'ui/elements/ActionButton'
import Button from '@material-ui/core/Button'
import { viewModes } from 'global-constants'
import { findIndex, insert, mergeRight, prop, propEq, remove } from 'ramda'

import { viewReadRequest } from 'store/views/actions'
import isTmpRule from 'lib/isTmpRule'

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

/**
 *
 * @param {string} ruleId -  a mongoDB ObjectID. Only used to get rule from Redux state
 * @param {object} rule - from Redux { _id, criteria[], actions[]}
 */

const Rule = ({
  areRequestsPending,
  criteriaTestClear,
  criteriaTestResults,
  criteriaTestReadRequest,
  rule,
  handleRuleCancelClick,
  handleRuleDeleteClick,
  saveRule,
  ruleId,
  ruleTmpAdd,
  ruleTmpRemove,
  ruleTmpUpdate
}) => {
  green('Rule: rule', rule)
  const { criteria, actions } = rule
  const [_viewMode, _setViewMode] = useState(
    isTmpRule(ruleId) ? viewModes.modeNew : viewModes.modeView
  )
  const [_dirty, _setDirty] = useState(false)

  const _classes = useStyles()

  if (areRequestsPending) {
    return null
  }

  const _handleRuleCancelClick = () => {
    criteriaTestClear()
    if (isTmpRule(ruleId)) {
      handleRuleCancelClick(ruleId)
    }
    _setViewMode(viewModes.modeView)
  }

  const _handleEditClick = criterionId => {
    ruleTmpAdd(rule)
    _setViewMode(viewModes.modeEdit)
  }

  const _handleDirtyChange = isDirty => {
    _setDirty(isDirty)
  }

  const _testCriteria = async () => {
    await criteriaTestReadRequest(criteria)
  }

  const _handleCriterionChange = criterion => {
    criteriaTestClear()

    const { criteria } = rule

    const criterionId = prop('_id', criterion)
    const idx = findIndex(propEq('_id', criterionId))(criteria)

    const newCriteria =
      criteria.length === 0 || idx === -1
        ? [criterion]
        : insert(idx, criterion, remove(idx, 1, criteria))

    const newRule = mergeRight(rule, { criteria: newCriteria })
    ruleTmpUpdate(newRule)
  }

  const _handleActionChange = action => {
    const { actions } = rule
    const actionId = prop('_id', action)
    const idx = findIndex(propEq('_id', actionId))(actions)
    const newActions =
      actions.length === 0 || idx === -1
        ? [action]
        : insert(idx, action, remove(idx, 1, actions))
    const newRule = mergeRight(rule, { actions: newActions })
    ruleTmpUpdate(newRule)
  }

  const _handleRuleSaveClick = async () => {
    criteriaTestClear()
    green('_handleRuleSaveClick: rule', rule)
    await saveRule(ruleId, rule)
    ruleTmpRemove(ruleId)
  }

  return (
    <div key={ruleId} className={_classes.wrapper}>
      <div>
        <div className={_classes.ruleTitle}>
          <div className={_classes.ruleId}>RuleId: {ruleId}</div>
          {_viewMode === viewModes.modeView ? (
            <ActionButton
              buttonType={buttonTypes.edit}
              onClick={_handleEditClick}
            />
          ) : (
            <>
              <ActionButton
                buttonType={buttonTypes.save}
                onClick={_handleRuleSaveClick}
                disabled={!_dirty}
              />
              <ActionButton
                buttonType={buttonTypes.cancel}
                onClick={_handleRuleCancelClick}
              />
              <ActionButton
                buttonType={buttonTypes.delete}
                onClick={handleRuleDeleteClick}
              />
              <Button variant="outlined" onClick={_testCriteria}>
                Test Criteria
              </Button>
            </>
          )}
        </div>
        <TestCriteriaResults arrayOfStrings={criteriaTestResults} />
        {criteria.map(c => {
          const { _id } = c
          if (_viewMode === viewModes.modeView) {
            return (
              <CriterionView
                key={_id}
                criterion={c}
                handleEditClick={_handleEditClick}
              />
            )
          }
          return (
            <CriterionEdit
              key={_id}
              criterion={c}
              handleDirtyChange={_handleDirtyChange}
              handleCriterionChange={_handleCriterionChange}
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
              handleDirtyChange={_handleDirtyChange}
              handleActionChange={_handleActionChange}
            />
          )
        })}
      </div>
    </div>
  )
}

const actions = {
  criteriaTestClear,
  criteriaTestReadRequest,
  ruleTmpAdd,
  ruleTmpRemove,
  ruleTmpUpdate,
  ruleUpdateRequest,
  allDataByDescriptionRequest: viewReadRequest
}

const mstp = (state, ownProps) => {
  const { ruleId } = ownProps
  green('mstp: ruleId', ruleId)
  green('mstp: state', state)
  const rule = getRuleById(state, ruleId)
  green('mstp: rule', rule)
  return {
    rule: rule,
    areRequestsPending: areRequestsPending(state),
    criteriaTestResults: getCriteriaTestResults(state)
  }
}

export default connect(mstp, actions)(Rule)

Rule.propTypes = {
  ruleId: PropTypes.string.isRequired,
  rule: PropTypes.object,
  ruleTmpAdd: PropTypes.func.isRequired,
  ruleTmpRemove: PropTypes.func.isRequired,
  ruleTmpUpdate: PropTypes.func.isRequired,
  ruleUpdateRequest: PropTypes.func.isRequired
}
