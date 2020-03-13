import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getRuleById, getRuleTmp } from 'store/rules/selectors'
import { ruleTmpAdd, ruleTmpClear, ruleTmpUpdate, ruleUpdateRequest } from 'store/rules/actions'
import { RULE_UPDATE_REQUEST_KEY } from 'store/rules/constants'
import { getRequest, areRequestsPending } from 'store/requests/selectors'
import { makeStyles } from '@material-ui/styles'
import CriterionView from './CriterionView'
import CriterionEdit from './CriterionEdit'
import ActionView from './ActionView'
import ActionEdit from './ActionEdit'
import ActionButton from 'ui/elements/ActionButton'
import { buttonTypes } from 'ui/elements/ActionButton'
import Button from '@material-ui/core/Button'
import { viewModes, actionTypes } from 'global-constants'
import {
  append,
  findIndex,
  insert,
  isEmpty,
  mergeRight,
  prop,
  propEq,
  remove,
  startsWith
} from 'ramda'
import isNilOrEmpty from 'lib/isNillOrEmpty'

import { getAllDataByDescription } from 'store/views/selectors'
import { allDataByDescriptionRequest } from 'store/views/actions'

// eslint-disable-next-line
import { green, red } from 'logger'


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
  ruleId,
  rule,
  ruleTmp,
  ruleTmpAdd,
  ruleTmpClear,
  ruleTmpUpdate,
  ruleUpdateRequest,
  ruleUpdateRequestStatus,
  allDataByDescriptionRequest
}) => {

  green('**rule', rule)
  const { criteria, actions } = rule
  const [_viewMode, _setViewMode] = useState(viewModes.modeView)
  const [_dirty, _setDirty] = useState(false)

  const _classes = useStyles()

  green('Rule: ruleUpdateRequestStatus', ruleUpdateRequestStatus)
  green('Rule: areRequestsPending', areRequestsPending)
  if (areRequestsPending) {
    return null
  }

  // useEffect(() => {
  //   if (_viewMode === viewModes.modeEdit) {
  //     ruleTmpAdd(rule)
  //   }
  // })

  const _handleEditClick = criterionId => {
    // _setEditId(criterionId)
    ruleTmpAdd(rule)
    _setViewMode(viewModes.modeEdit)
  }

  const _handleCancelClick = () => {
    ruleTmpClear()
    _setViewMode(viewModes.modeView)
  }

  const _handleSaveClick = async () => {
    green('_handleSaveClick')
    green('_handleSaveClick: ruleId', ruleId)
    if (startsWith('tmp_', ruleId)) {
      green('yes')
    } else {
      await ruleUpdateRequest(ruleId, ruleTmp)
      await allDataByDescriptionRequest('all-data-by-description')
    }
  }

  const _handleDeleteClick = () => {}

  const _handleDirtyChange = isDirty => {
    _setDirty(isDirty)
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
              <Button variant="outlined">Test Criteria</Button>
            </>
          )}
        </div>
        {criteria.map(c => {
          const { _id } = c
          if (_viewMode === viewModes.modeEdit) {
            return (
              <CriterionEdit
                key={_id}
                criterion={c}
                handleDirtyChange={_handleDirtyChange}
                handleCriterionChange={_handleCriterionChange}
              />
            )
          }
          return (
            <CriterionView
              key={_id}
              criterion={c}
              handleEditClick={_handleEditClick}
            />
          )
        })}
        {actions.map(a => {
          const { _id } = a
          if (_viewMode === viewModes.modeEdit) {
            return (
              <ActionEdit
                key={_id}
                action={a}
                handleDirtyChange={_handleDirtyChange}
                handleActionChange={_handleActionChange}
              />
            )
          }
          return <ActionView key={_id} action={a} />
        })}
      </div>
    </div>
  )
}

const actions = {
  ruleTmpAdd,
  ruleTmpClear,
  ruleTmpUpdate,
  ruleUpdateRequest,
  allDataByDescriptionRequest
}

const mapStateToProps = (state, ownProps) => {
  const { ruleId } = ownProps
  // green('mstp: state', state)
  // green('mstp: ruleId', ruleId)
  const rule = getRuleById(state, ruleId)
  const ruleTmp = getRuleTmp(state)
  // console.group('Rule.mstp')
  // green('ruleId', ruleId)
  // green('state', state)
  // // green('state.ruleTMp', state.ruleTmp)
  // green('rule', rule)
  // green('ruleTmp', ruleTmp)
  // console.groupEnd()
  return {
    // if the rule is not found return undefined so that the default value for rule will be used above
    //  getRuleById know to look in ruleTmp if ruleId starts with tmp_ and rules otherwise
    rule: rule,
    ruleTmp: ruleTmp,
    ruleUpdateRequestStatus: getRequest(state, RULE_UPDATE_REQUEST_KEY),
    areRequestsPending: areRequestsPending(state)
  }
}

export default connect(mapStateToProps, actions)(Rule)

Rule.propTypes = {
  ruleId: PropTypes.string.isRequired,
  rule: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    criteria: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  ruleTmpAdd: PropTypes.func.isRequired,
  ruleTmpClear: PropTypes.func.isRequired,
  ruleTmpUpdate: PropTypes.func.isRequired,
  ruleUpdateRequest: PropTypes.func.isRequired,
  ruleUpdateRequestStatus: PropTypes.string
  
}
