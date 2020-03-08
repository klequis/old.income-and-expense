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
import { ruleUpdateRequest } from 'store/rules/actions'
// import replaceArrayItem from 'lib'
import {
  mergeRight,
  isEmpty,
  insert,
  findIndex,
  propEq,
  remove,
  prop
} from 'ramda'

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

const Rule = ({ rule, ruleUpdateRequest }) => {
  const { _id, actions, criteria } = rule
  const [ruleId, setRuleId] = useState(_id)
  const [ruleActions, setRuleActions] = useState(actions)
  const [ruleCriteria, setRuleCriteria] = useState(criteria)
  const [editMode, setEditMode] = useState(false)

  const classes = useStyles()

  const key1 = shortid.generate()
  const key2 = shortid.generate()



  green('Rule: rule', rule)

  // TODO: updateRule code goes into applyRule
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

  const applyRule = async () => {
    // const newRule = mergeRight(rule, { criteria: newCriteria })
    // and same for actions
    // const r = await ruleUpdateRequest(_id, newRule)
    // green('Rule.applyRule: r', r)
  }

  const updateCriterion = newCriterion => {
    const criterionId = prop('_id', newCriterion)
    const idx = findIndex(propEq('_id', criterionId))(ruleCriteria)
    const newCriteria = insert(idx, newCriterion, remove(idx, 1, ruleCriteria))
    setRuleCriteria(newCriteria)
  }

  const updateAction = newAction => {
    const actionId = prop('_id', newAction)
    const idx = findIndex(propEq('_id', actionId))(ruleActions)
    const newActions = insert(idx, newAction, remove(idx, 1, ruleActions))
    setRuleActions(newActions)
  }

  const handleEditRuleClick = () => setEditMode(!editMode)

  return (
    <div key={key1} className={classes.rule}>
      <div>
        <div className={classes.ruleTitle}>
          <div className={classes.ruleId}>RuleId: {_id}</div>
          <IconButton onClick={handleEditRuleClick}>
            {editMode ? <CancelIcon /> : <EditIcon />}
          </IconButton>
          {editMode ? (
            <div>
              <IconButton onClick={applyRule}>
                <SaveIcon />
              </IconButton>
              <IconButton>
                <DeleteForeverIcon />
              </IconButton>
            </div>
          ) : null}
        </div>
        <div className={classes.criteriaTitle}>
          Criteria{' '}
          <IconButton>
            <AddIcon />
          </IconButton>
        </div>
        <Criteria
          key={key2}
          criteria={criteria}
          editMode={editMode}
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
          editMode={editMode}
          updateAction={updateAction}
        />
      </div>
    </div>
  )
}

const actions = {
  ruleUpdateRequest
}

const mapStateToProps = state => {
  return {
    data: {}
  }
}

export default connect(mapStateToProps, actions)(Rule)

/*
import React from 'react'
import Criteria from './Criteria'
import Actions from './Actions'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  rule: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  ruleId: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold'
  },
  actionButton: {
    marginRight: 30
  }
})

const Rule = ({ rules, updateRule }) => {
  const classes = useStyles()
  if (rules.length > 0) {
    const a = rules.map(rule => {
      const { _id, criteria, actions } = rule
      // green('Rule: criteria', criteria)
      return (
        <div className={classes.rule}>
          <div>
            <div className={classes.ruleId}>RuleId: {_id}</div>
            <Criteria criteria={criteria} updateRule={updateRule} />
            <hr/>
            <Actions actions={actions} />
          </div>
          <div >
            <button className={classes.actionButton}>Update</button>
            <button className={classes.actionButton}>Delete</button>
          </div>
        </div>
      )
    })
    return a
  }
  return null
}

export default Rule

*/
