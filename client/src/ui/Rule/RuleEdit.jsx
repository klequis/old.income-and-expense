import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ruleUpdateRequest } from 'store/rules/actions'
import { getRuleById } from 'store/rules/selectors'
import {
  criteriaTestReadRequest,
  criteriaTestClear
} from 'store/criteriaTest/actions'
import { getCriteriaTestResults } from 'store/criteriaTest/selectors'
import { ruleTmpAdd, ruleTmpClear, ruleTmpUpdate } from 'store/rules/actions'

import Actions from './Actions'
import { makeStyles } from '@material-ui/styles'

import Criterion from './Criterion'
import shortid from 'shortid'
import Button from '@material-ui/core/Button'
import TestCriteriaResults from './TestCriteriaResults'
import RuleActionButtons from './RuleActionButtons'
import ActionButton from 'ui/elements/ActionButton'
import { buttonTypes } from 'ui/elements/ActionButton'
// import replaceArrayItem from 'lib'
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

import { viewModes } from 'global-constants'

// eslint-disable-next-line
import { green, red } from 'logger'

const useStyles = makeStyles({
  rule: {
    display: 'flex',
    alignItems: 'flex-end'
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
 * @param {function} ruleUpdateRequest - Redux action
 * @param {function} ruleCreateRequest - Redux action
 * @param {object} rule - from Redux { _id, criteria[], actions[]}
 */

const Rule = ({
  ruleId,
  rule,
  ruleUpdateRequest,
  criteriaTestClear,
  criteriaTestResults,
  criteriaTestReadRequest,
  ruleTmpAdd,
  ruleTmpClear,
  ruleTmpUpdate
}) => {
  // console.group('Rule')
  // green('ruleid', ruleId)
  // green('rule', rule)
  // console.groupEnd()

  // state
  // green('rule', rule)
  // const [_origId, _setOrigId] = useState()
  // const [_actions, _setActions] = useState(actions)

  // TODO: what should the initial viewMode be?
  // const newMode = startsWith('tmp_', ruleId)
  // const [_viewMode, _setViewMode] = useState(
  //   newMode ? viewModes.modeNew : viewModes.modeView
  // )
  
  useEffect(() => {
    if (startsWith('tmp_', ruleId)) {
      ruleTmpAdd({ _id: ruleId, criteria: [], actions: [] })
    }
  }, [])

  const { criteria, actions } = rule

  const _classes = useStyles()

  // methods

  // const _handleCancelClick = () => {
  //   // TODO
  // }

  // const _handleDeleteClick = () => {
  //   // TODO
  // }

  // const _handleEditclick = () => {
  //   green('Rule._handleEditclick')
  //   if (_viewMode === viewModes.modeNew) {
  //     _setViewMode(viewModes.modeNew)
  //   }
  //   if (_viewMode === viewModes.modeView) {
  //     _setViewMode(viewModes.modeEdit)
  //   }
  //   if (_viewMode === viewModes.modeEdit) {
  //     _setViewMode(viewModes.modeView)
  //   }
  // }

  // const _handleSaveClick = async () => {
  //   // TODO: logic needs to change to handle tmp_ rule differently

  //   const newRule = mergeRight(rule, {
  //     criteria: _criteria,
  //     actions: _actions
  //   })
  //   const r = await ruleUpdateRequest(ruleId, newRule)
  // }

  // const _newAction = () => {
  //   // TODO
  // }

  // const _newCriterion = () => {
  //   const c = {
  //     _id: `tmp_${shortid.generate()}`,
  //     field: '',
  //     operation: '',
  //     value: ''
  //   }
  //   _setCriteria(append(c, _criteria))
  // }

  // const _testCriteria = async () => {
  //   await criteriaTestReadRequest(_criteria)
  // }

  // const _criteriaTestClear = () => {
  //   criteriaTestClear()
  // }

  // const _updateActions = newAction => {
  //   // TODO: logic here should be similar to updateCriterion
  //   const actionId = prop('_id', newAction)
  //   const idx = findIndex(propEq('_id', actionId))(_actions)
  //   const newActions = insert(idx, newAction, remove(idx, 1, _actions))
  //   _setActions(newActions)
  // }

  const _updateCriteria = criterion => {
    const { criteria } = rule

    const criterionId = prop('_id', criterion)
    const idx = findIndex(propEq('_id', criterionId))(criteria)

    green('updateCriteria: criterion')
    green('updateCriterion: idx', idx)

    const newCriteria =
      criteria.length === 0 || idx === -1
        ? [criterion]
        : insert(idx, criterion, remove(idx, 1, _criteria))

    const newRule = mergeRight(rule, { criteria: newCriteria })
    ruleTmpUpdate(newRule)
  }

  

  return (
    <div key={ruleId} className={_classes.rule}>
      <div>
        {/* <div className={_classes.ruleTitle}>
          <div className={_classes.ruleId}>RuleId: {ruleId}</div>
          <RuleActionButtons 
            handleCancelClick={_handleCancelClick}
            handleDeleteClick={_handleDeleteClick}
            handleEditClick={_handleEditclick}
            handleSaveClick={_handleSaveClick}
            viewMode={_viewMode}
          />
        </div> */}
        {/* <TestCriteriaResults arrayOfStrings={criteriaTestResults} /> */}
        {/* <div className={_classes.actionsTitle}>
          Criteria{' '}
          <ActionButton buttonType={buttonTypes.add} onClick={_newCriterion} />
          <Button onClick={_testCriteria}>Test Criteria</Button>
        </div> */}
        {criteria.map(c => {
          const { _id } = c
          return (
            <Criterion
              key={_id}
              criterion={c}
              // updateCriteria={_updateCriteria}
              // criteriaTestClear={_criteriaTestClear}
            />
          )
        })}
        <div className={_classes.actionsTitle}>
          Actions{' '}
          <ActionButton 
            buttonType={buttonTypes.add} 
            // onClick={_newAction} 
          />
        </div>
        <Actions
          key={shortid.generate()}
          actions={actions}
          // editMode={_viewMode === viewModes.modeEdit}
          // updateAction={_updateActions}
        />
      </div>
    </div>
  )
}

const actions = {
  criteriaTestClear,
  criteriaTestReadRequest,
  ruleUpdateRequest,
  ruleTmpAdd,
  ruleTmpClear,
  ruleTmpUpdate
}

const mapStateToProps = (state, ownProps) => {
  // TODO: is this always 'ruleId' or is it sometimes _id
  const { ruleId } = ownProps
  const r0 = getRuleById(state, ruleId)
  const r1 = isEmpty(r0) ? { _id: ruleId, criteria: [], actions: [] } : r0
  green('mstp: r1', r1)
  return {
    // if the rule is not found return undefined so that the default value for rule will be used above
    //  getRuleById know to look in ruleTmp if ruleId starts with tmp_ and rules otherwise
    rule: r1,
    criteriaTestResults: getCriteriaTestResults(state)
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
  ruleUpdateRequest: PropTypes.func.isRequired,
  criteriaTestReadRequest: PropTypes.func.isRequired,
  criteriaTestResults: PropTypes.array.isRequired,
  criteriaTestClear: PropTypes.func.isRequired,
  ruleTmpAdd: PropTypes.func.isRequired,
  ruleTmpClear: PropTypes.func.isRequired,
  ruleTmpUpdate: PropTypes.func.isRequired
}

// TODO: updateRule code goes into applyRule - not used here
// const updateRule = async ({ newCriterion = {}, newAction = {} }) => {
//   if (!isEmpty(newAction)) {
//     green('updateRule: newAction', newAction)
//   } else {
//     const { criteria } = rule
//     const replacedCriteria = replaceCriterion(criteria, newCriterion)
//     const newRule = mergeRight(rule, { criteria: replacedCriteria })

//     console.group('updateRule')
//     green('criteria', criteria)
//     green('newCriterion', newCriterion)
//     green('replacedCriteria', replacedCriteria)
//     green('newRule', newRule)
//     console.groupEnd()
//     const r = await ruleUpdateRequest(_id, newRule)
//     green('r', r)
//   }
// }
