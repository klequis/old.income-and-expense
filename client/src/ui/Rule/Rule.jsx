import React from 'react'
import Criteria from './Criteria'
import Actions from './Actions'
import { makeStyles } from '@material-ui/styles'
import shortid from 'shortid'
import { connect } from 'react-redux'
import { ruleUpdateRequest } from 'store/rules/actions'
// import replaceArrayItem from 'lib'
import { isEmpty, insert, findIndex, propEq, remove, prop } from 'ramda'

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
  }
})

const replaceCriterion = (criteria, criterion) => {
  const idx = findIndex(propEq('_id', prop('_id', criterion)))(criteria)
  const r = insert(idx, criterion, remove(idx, 1, criteria))
  // console.group('replaceCriterion')
  // green('criteria', criteria)
  // green('criterion', criterion)
  // green('idx', idx)
  // green('r', r)
  // console.groupEnd()
  return r
}

const Rule = ({ rule, ruleUpdateRequest }) => {
  const classes = useStyles()
  const { _id, actions, criteria } = rule
  const key1 = shortid.generate()
  const key2 = shortid.generate()
  green('rule', rule)

  const updateRule = async ({ newCriterion = {}, newAction = {} }) => {
    if (!isEmpty(newAction)) {
      green('updateRule: newAction', newAction)
    } else {
      const { criteria } = rule
      console.group('updateRule')
      green('updateRule: criteria', criteria)
      green('updateRule: newCriterion', newCriterion)
      console.groupEnd()
      const replacedCriteria = replaceCriterion(criteria, newCriterion)

      // const mergedCriterion = mergeRight(criterion, newCriterion)
      // green('updateRule: mergedCriterion', mergedCriterion)
      // const newRule = mergeRight(rule, { criteria: newCriterion })
      // green('updateRule: newRule', newRule)
      // const r = await ruleUpdateRequest(_id, mergeRight(rule, criterion))
      // green('r', r)
    }
  }

  return (
    <div key={key1} className={classes.rule}>
      <div>
        <div className={classes.ruleId}>RuleId: {_id}</div>
        <div className={classes.criteriaTitle}>Criteria</div>
        <Criteria key={key2} criteria={criteria} updateRule={updateRule} />
        <div className={classes.actionsTitle}>Actions</div>
        <Actions key={shortid.generate()} actions={actions} />
      </div>
      <div>
        {/* <button className={classes.actionButton}>Update</button> */}
        {/* <button className={classes.actionButton}>Delete</button> */}
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
