import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ruleUpdateRequest } from 'store/rules/actions'
import { getRuleById } from 'store/rules/selectors'
import { criteriaTestReadRequest } from 'store/criteriaTest/actions'
import { getCriteriaTestResults } from 'store/criteriaTest/selectors'

import Actions from './Actions'
import { makeStyles } from '@material-ui/styles'
import ActionButton from 'ui/elements/ActionButton'
import { buttonTypes } from 'ui/elements/ActionButton'
import Criterion from './Criterion'
import shortid from 'shortid'
import Button from '@material-ui/core/Button'
import TestCriteriaResults from './TestCriteriaResults'


// import replaceArrayItem from 'lib'
import {
  append,
  mergeRight,
  insert,
  findIndex,
  propEq,
  startsWith,
  remove,
  prop
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

const Rule = ({ ruleId, rule, ruleUpdateRequest, criteriaTestResults, criteriaTestReadRequest }) => {

  // console.group('Rule')
  // green('ruleid', ruleId)
  // green('rule', rule)
  // console.groupEnd()

  // state

  

  const { actions, criteria } = rule
  const [_actions, _setActions] = useState(actions)
  const [_criteria, _setCriteria] = useState(criteria)

  // TODO: what should the initial viewMode be?
  const newMode = startsWith('tmp_', ruleId)
  const [_viewMode, _setViewMode] = useState(newMode ? viewModes.modeNew : viewModes.modeView)

  const _classes = useStyles()

  // methods

  const _handleCancelClick = () => {
    // TODO
  }

  const _handleDeleteClick = () => {
    // TODO
  }

  const _handleEditclick = () => {
    green('Rule._handleEditclick')
    if (_viewMode === viewModes.modeNew) {
      _setViewMode(viewModes.modeNew)
    }
    if (_viewMode === viewModes.modeView) {
      _setViewMode(viewModes.modeEdit)
    }
    if (_viewMode === viewModes.modeEdit) {
      _setViewMode(viewModes.modeView)
    }
  }

  const _handleSaveClick = async () => {
    // TODO: logic needs to change to handle tmp_ rule differently
    
    const newRule = mergeRight(rule, {
      criteria: _criteria,
      actions: _actions
    })
    const r = await ruleUpdateRequest(ruleId, newRule)
  }

  const _newAction = () => {
    // TODO
  }

  const _newCriterion = () => {
    // TODO
    const c = {
      _id: `tmp_${shortid.generate()}`,
      field: '',
      operation: '',
      value: ''
    }
    // green('c', c)
    _setCriteria(append(c, _criteria))
  }

  const _testCriteria = async () => {
    await criteriaTestReadRequest(_criteria)
  }

  const _updateActions = newAction => {
    // TODO: logic here should be similar to updateCriterion
    const actionId = prop('_id', newAction)
    const idx = findIndex(propEq('_id', actionId))(_actions)
    const newActions = insert(idx, newAction, remove(idx, 1, _actions))
    _setActions(newActions)
  }

  const _updateCriteria = criterion => {
    const criterionId = prop('_id', criterion)
    const idx = findIndex(propEq('_id', criterionId))(_criteria)
    if (_criteria.length === 0 || idx === -1) {
      _setCriteria(append(criterion, _criteria))
    } else {
      const newCriteria = insert(idx, criterion, remove(idx, 1, _criteria))
      _setCriteria(newCriteria)
    }
  }

  const RuleActionButtons = () => {
    if (_viewMode === viewModes.modeEdit) {
      return (
        <>
          <ActionButton buttonType={buttonTypes.save} />
          <ActionButton buttonType={buttonTypes.cancel} />
          <ActionButton buttonType={buttonTypes.delete} />
        </>
      )
    }
    if (_viewMode === viewModes.modeNew) {
      return (
        <>
          <ActionButton buttonType={buttonTypes.save} />
          <ActionButton buttonType={buttonTypes.cancel} />
        </>
      )
    }
    return <ActionButton buttonType={buttonTypes.edit} />
  }
  
  return (
    <div key={ruleId} className={_classes.rule}>
      <div>
        <div className={_classes.ruleTitle}>
          <div className={_classes.ruleId}>RuleId: {ruleId}</div>
          <RuleActionButtons />
          
        </div>
        <TestCriteriaResults arrayOfStrings={criteriaTestResults} />
        <div className={_classes.actionsTitle}>
          Criteria <ActionButton buttonType={buttonTypes.add} onClick={_newCriterion} />
          <Button onClick={_testCriteria}>Test Criteria</Button>
        </div>
        {_criteria.map(c => {
          const { _id } = c
          return (
            <Criterion
              key={_id}
              criterion={c}
              updateCriteria={_updateCriteria}
            />
          )
        })}
        <div className={_classes.actionsTitle}>
          Actions <ActionButton buttonType={buttonTypes.add} />
        </div>
        <Actions
          key={shortid.generate()}
          actions={actions}
          editMode={_viewMode === viewModes.modeEdit}
          updateAction={_updateActions}
        />
      </div>
    </div>
  )
}

const actions = {
  criteriaTestReadRequest,
  ruleUpdateRequest
}

const mapStateToProps = (state, ownProps) => {
  // TODO: is this always 'ruleId' or is it sometimes _id
  const { ruleId } = ownProps
  return {
    // if the rule is not found return undefined so that the default value for rule will be used above
    rule: getRuleById(state, ruleId) || undefined,
    criteriaTestResults: getCriteriaTestResults(state)
  }
}

export default connect(mapStateToProps, actions)(Rule)

Rule.propTypes = {
  ruleId: PropTypes.string.isRequired,
  rule: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    criteria: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.arrayOf(PropTypes.object).isRequired,
    ruleIds: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  ruleUpdateRequest: PropTypes.func.isRequired,
  criteriaTestReadRequest: PropTypes.func.isRequired,
  criteriaTestResults: PropTypes.array.isRequired
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

