import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getRuleById, getRuleTmp } from 'store/rules/selectors'
import {
  ruleTmpAdd,
  ruleTmpClear,
  ruleTmpUpdate,
  ruleUpdateRequest,
  ruleDeleteRequest
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
import {
  findIndex,
  insert,
  mergeRight,
  prop,
  propEq,
  remove,
  startsWith
} from 'ramda'

import { viewReadRequest } from 'store/views/actions'

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
  ruleDeleteRequest,
  ruleId,
  ruleTmp,
  ruleTmpAdd,
  ruleTmpClear,
  ruleTmpUpdate,
  ruleUpdateRequest,
  updateRulesAndData,
  view
}) => {
  // green('Rule: ruleId', ruleId)
  green('Rule: ruleTmp', ruleTmp)
  const newMode = startsWith('tmp_', ruleId) ? true : false
  const { criteria, actions } = rule
  const [_viewMode, _setViewMode] = useState(
    newMode ? viewModes.modeNew : viewModes.modeView
  )
  const [_dirty, _setDirty] = useState(false)

  const _classes = useStyles()

  // return null

  useEffect(() => {
    ruleTmpAdd(ruleTmp)
  })

  if (areRequestsPending) {
    return null
  }

  const _handleCancelClick = () => {
    ruleTmpClear()
    _setViewMode(viewModes.modeView)
  }

  const _handleDeleteClick = async () => {
    green('_handleDeleteClick: _id', ruleId)
    yellow('before delete')
    await ruleDeleteRequest(ruleId)
    yellow('before update')

    await updateRulesAndData(view)

    yellow('before clear')
    ruleTmpClear()
    yellow('done')
  }

  const _handleEditClick = criterionId => {
    // _setEditId(criterionId)
    ruleTmpAdd(rule)
    _setViewMode(viewModes.modeEdit)
  }

  const _handleSaveClick = async () => {
    if (startsWith('tmp_', ruleId)) {
      red('TODO: tmp rule not implemented')
    } else {
      await ruleUpdateRequest(ruleId, ruleTmp)
      await updateRulesAndData(view)
      // await allDataByDescriptionRequest('all-data-by-description')
    }
  }

  const _handleDirtyChange = isDirty => {
    _setDirty(isDirty)
  }

  const _testCriteria = async () => {
    await criteriaTestReadRequest(criteria)
  }

  const _criteriaTestClear = () => {
    criteriaTestClear()
  }

  const _handleCriterionChange = criterion => {
    const { criteria } = ruleTmp

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
    // validateAction(action)
    const { actions } = ruleTmp
    const actionId = prop('_id', action)
    const idx = findIndex(propEq('_id', actionId))(actions)
    const newActions =
      actions.length === 0 || idx === -1
        ? [action]
        : insert(idx, action, remove(idx, 1, actions))
    const newRule = mergeRight(rule, { actions: newActions })
    ruleTmpUpdate(newRule)
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
                onClick={_handleSaveClick}
                disabled={!_dirty}
              />
              <ActionButton
                buttonType={buttonTypes.cancel}
                onClick={_handleCancelClick}
              />
              <ActionButton
                buttonType={buttonTypes.delete}
                onClick={_handleDeleteClick}
              />
              <Button variant="outlined" onClick={_testCriteria}>Test Criteria</Button>
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
  ruleDeleteRequest,
  ruleTmpAdd,
  ruleTmpClear,
  ruleTmpUpdate,
  ruleUpdateRequest,
  allDataByDescriptionRequest: viewReadRequest
}

const mapStateToProps = (state, ownProps) => {
  const { ruleId } = ownProps
  // green('mstp: state', state)
  // green('mstp: ownProps', ownProps)
  // green('mstp: ruleId', ruleId)
  const rule = getRuleById(state, ruleId)
  const ruleTmp = getRuleTmp(state)
  // console.group('Rule.mstp')
  // green('ruleId', ruleId)
  // green('state', state)
  // // green('state.ruleTMp', state.ruleTmp)
  // green('mstp: rule', rule)
  // green('mstp: ruleTmp', ruleTmp)
  // console.groupEnd()
  return {
    // if the rule is not found return undefined so that the default value for rule will be used above
    //  getRuleById know to look in ruleTmp if ruleId starts with tmp_ and rules otherwise
    rule: rule,
    ruleTmp: ruleTmp,
    areRequestsPending: areRequestsPending(state),
    criteriaTestResults: getCriteriaTestResults(state)
  }
}

export default connect(mapStateToProps, actions)(Rule)

Rule.propTypes = {
  ruleId: PropTypes.string.isRequired,
  // rule: PropTypes.shape({
  //   _id: PropTypes.string.isRequired,
  //   criteria: PropTypes.arrayOf(PropTypes.object).isRequired,
  //   actions: PropTypes.arrayOf(PropTypes.object).isRequired
  // }),
  rule: PropTypes.object,
  ruleTmp: PropTypes.object,
  ruleDeleteRequest: PropTypes.func.isRequired,
  ruleTmpAdd: PropTypes.func.isRequired,
  ruleTmpClear: PropTypes.func.isRequired,
  ruleTmpUpdate: PropTypes.func.isRequired,
  ruleUpdateRequest: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired
}

/*

const validateAction = ({
    _id,
    action,
    field,
    findValue,
    numAdditionalChars,
    replaceWithValue,
    category1,
  }) => {
    const errors = []
    const possibleActionTypes = [actionTypes.omit, actionTypes.strip, actionTypes.replaceAll, actionTypes.categorize]
    if (isNilOrEmpty(_id)) {
      errors.push('Missing or invalid _id')
    }
    if (isNilOrEmpty(action)) {
      errors.push('Missing action')
    }
    if (!possibleActionTypes.includes(action)) {
      errors.push('Unknown action type')
    }

    // field: strip, replaceAll

    if (action === actionTypes.strip || action === actionTypes.replaceAll) {
      if (isNilOrEmpty(field)) {
        errors.push(`Invalid or missing value for 'field'.`)
      }
    }

    // findValue: strip
    if (action === actionTypes.strip) {
      if (isNilOrEmpty(findValue)) {
        errors.push(`Invalid or missing value for 'findValue'.`)
      }
    }

    // numAdditionalChars: strip
    if (action === actionTypes.numAdditionalChars) {
      if (isNilOrEmpty(numAdditionalChars)) {
        errors.push(`Invalid or missing value for 'numAdditionalChars'.`)
      }
    }
    // replaceWithValue: replaceall
    if (action === actionTypes.replaceAll) {
      if (isNilOrEmpty(replaceWithValue)) {
        errors.push(`Invalid or missing value for 'replaceWithValue'.`)
      }
    }

    if (action === actionTypes.categorize) {
      if (isNilOrEmpty(category1)) {
        errors.push(`Invalid or missing value for 'category1'.`)
      }
    }
    red('validateAction ERROR', errors)
  }

*/
