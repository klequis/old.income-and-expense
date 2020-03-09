import React, { useState } from 'react'
import Criteria from './Criteria'
import Actions from './Actions'
import { makeStyles } from '@material-ui/styles'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import AddIcon from '@material-ui/icons/Add'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import IconButton from '@material-ui/core/IconButton'

import shortid from 'shortid'
import { connect } from 'react-redux'
import { ruleUpdateRequest, ruleCreate } from 'store/rules/actions'
import { getRuleById } from 'store/rules/selectors'
import { ObjectID } from 'mongodb'
// import replaceArrayItem from 'lib'
import {
  append,
  mergeRight,
  isEmpty,
  insert,
  findIndex,
  propEq,
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
 * @param {function} ruleUpdateRequest - a Redux action
 * @param {object} rule - from Redux { _id, criteria[], actions[]}
 */

const Rule = ({ ruleId, ruleUpdateRequest, rule }) => {
  const { actions, criteria } = rule
  const [_actions, _setActions] = useState(actions)
  const [_criteria, _setCriteria] = useState(criteria)
  const [_viewMode, _setViewMode] = useState(
    ruleId === viewModes.modeNew ? viewModes.modeNew : viewModes.modeView
  )

  const _classes = useStyles()

  const _newCriterion = () => {
    
    // TODO
    const c = {
      _id: ObjectID.generate(),
      field: '',
      operation: '',
      value: ''
    }
    _setCriteria(append(c, _criteria))
  }

  const _newAction = () => {
    // TODO
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

  const _updateActions = newAction => {
    // TODO: logic here should be similar to updateCriterion
    const actionId = prop('_id', newAction)
    const idx = findIndex(propEq('_id', actionId))(_actions)
    const newActions = insert(idx, newAction, remove(idx, 1, _actions))
    _setActions(newActions)
  }

  const _handleSaveClick = async () => {
    const newRule = mergeRight(rule, {
      criteria: _criteria,
      actions: _actions
    })
    const r = await ruleUpdateRequest(ruleId, newRule)
  }

  const _handleCancelClick = () => {
    // TODO
  }

  const _handleEditclick = () => {
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

  const _handleDeleteClick = () => {
    // TODO
  }

  const SaveButton = () => (
    <IconButton onClick={_handleSaveClick}>
      <SaveIcon />
    </IconButton>
  )

  const CancelButton = () => (
    <IconButton>
      <CancelIcon />
    </IconButton>
  )

  const DeleteButton = () => (
    <IconButton>
      <DeleteForeverIcon />
    </IconButton>
  )

  const EditButton = () => (
    <IconButton>
      <EditIcon />
    </IconButton>
  )

  const RuleActionButtons = () => {
    if (_viewMode === viewModes.modeEdit) {
      return (
        <>
          <SaveButton />
          <CancelButton />
          <DeleteButton />
        </>
      )
    }
    if (_viewMode === viewModes.modeNew) {
      return (
        <>
          <SaveButton />
          <CancelButton />
        </>
      )
    }
    return <EditButton />
  }

  return (
    <div key={ruleId} className={_classes.rule}>
      <div>
        <div className={_classes.ruleTitle}>
          <div className={_classes.ruleId}>RuleId: {ruleId}</div>
          <RuleActionButtons />
        </div>

        <Criteria
          key={shortid.generate()}
          criteria={_criteria}
          viewMode={_viewMode === viewModes.modeEdit}
          updateCriterion={_updateCriteria}
        />
        <div className={_classes.actionsTitle}>
          Actions{' '}
          <IconButton>
            <AddIcon />
          </IconButton>
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
  ruleUpdateRequest
}

const mapStateToProps = (state, ownProps) => {
  // 'rule' is a MongoDB ObjectID as string
  const { rule } = ownProps

  return {
    // if the rule is not found return undefined so that the default value for rule will be used above
    rule: getRuleById(state, rule) || undefined
  }
}

export default connect(mapStateToProps, actions)(Rule)

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
