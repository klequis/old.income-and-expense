import React, { useState } from 'react'
import Criteria from './Criteria'
import Actions from './Actions'
import { makeStyles } from '@material-ui/styles'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import AddIcon from '@material-ui/icons/Add'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import DoneIcon from '@material-ui/icons/Done'
import IconButton from '@material-ui/core/IconButton'

import shortid from 'shortid'
import { connect } from 'react-redux'
import { ruleUpdateRequest, ruleCreate } from 'store/rules/actions'
import { getRuleById } from 'store/rules/selectors'
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
  criteriaTitle: {
    fontWeight: 'bold',
    paddingTop: 8,
    paddingBottom: 4
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

// ruleId is sent from parent
// rule comes from Redux state
// if no rule with ruleId is found in state, rule is set to a new rule
const Rule = ({
  ruleId, // only used to get rule from Redux state
  ruleUpdateRequest,
  rule = { _id: 'newRule', criteria: [], actions: [] }
}) => {
  green('Rule.rule', rule)
  const { actions, criteria } = rule
  // const [ruleId, setRuleId] = useState(_id)
  const [ruleActions, setRuleActions] = useState(actions)
  const [ruleCriteria, setRuleCriteria] = useState(criteria)
  const [editMode, setEditMode] = useState(
    ruleId === viewModes.modeNew ? viewModes.modeNew : viewModes.modeView
  )

  green('Rule.editMode', editMode)
  const classes = useStyles()

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

  const saveRule = async () => {
    const newRule = mergeRight(rule, {
      criteria: ruleCriteria,
      actions: ruleActions
    })
    const r = await ruleUpdateRequest(ruleId, newRule)
    green('Rule.saveRule: r', r)
  }

  const updateCriterion = newCriterion => {
    green('newCriterion', newCriterion)
    const criterionId = prop('_id', newCriterion)
    const idx = findIndex(propEq('_id', criterionId))(ruleCriteria)
    const newCriteria = insert(idx, newCriterion, remove(idx, 1, ruleCriteria))
    setRuleCriteria(newCriteria)
  }

  const addNewCriterion = () => {
    const newCriterion = {
      _id: 'newCriterion',
      field: '',
      operation: '',
      value: ''
    }
    setRuleCriteria(append(newCriterion, ruleCriteria))
  }

  const updateAction = newAction => {
    const actionId = prop('_id', newAction)
    const idx = findIndex(propEq('_id', actionId))(ruleActions)
    const newActions = insert(idx, newAction, remove(idx, 1, ruleActions))
    setRuleActions(newActions)
  }

  const handleEditRuleClick = () => {
    if (editMode === viewModes.modeNew) {
      return
    }
    if (editMode === viewModes.modeView) {
      setEditMode(viewModes.modeEdit)
    }
    if (editMode === viewModes.modeEdit) {
      setEditMode(viewModes.modeView)
    }
  }

  const handleAddCriterionClick = () => {
    addNewCriterion()
  }

  green('ruleCriteria', ruleCriteria)

  const SaveButton = () => (
    <IconButton onClick={saveRule}>
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
    green('editMode', editMode)
    // modes: view, edit, new
    // buttons: save, cancel, delete, edit
    if (editMode === viewModes.modeEdit) {
      return (
        <>
          <SaveButton />
          <CancelButton />
          <DeleteButton />
        </>
      )
    }
    if (editMode === viewModes.modeNew) {
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
    <div key={ruleId} className={classes.rule}>
      <div>
        <div className={classes.ruleTitle}>
          <div className={classes.ruleId}>RuleId: {ruleId}</div>
          <RuleActionButtons />
        </div>
        <div className={classes.criteriaTitle}>
          Criteria{' '}
          <IconButton onClick={handleAddCriterionClick}>
            <AddIcon />
          </IconButton>
        </div>
        <Criteria
          key={shortid.generate()}
          criteria={ruleCriteria}
          editMode={editMode === viewModes.modeEdit}
          updateCriterion={updateCriterion}
        />
        <div className={classes.actionsTitle}>
          Actions{' '}
          <IconButton>
            <AddIcon />
          </IconButton>
        </div>
        <Actions
          key={shortid.generate()}
          actions={actions}
          editMode={editMode === viewModes.modeEdit}
          updateAction={updateAction}
        />
      </div>
    </div>
  )
}

const actions = {
  ruleUpdateRequest
}

const mapStateToProps = (state, ownProps) => {
  green('ownProps', ownProps)
  // 'rule' is a MongoDB ObjectID as string
  const { rule } = ownProps
  return {
    // if the rule is not found return undefined so that the default value for rule will be used above
    rule: getRuleById(state, rule) || undefined
  }
}

export default connect(mapStateToProps, actions)(Rule)
