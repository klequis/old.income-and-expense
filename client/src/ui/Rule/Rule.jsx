import React from 'react'
import Criteria from './Criteria'
import Actions from './Actions'
import { makeStyles } from '@material-ui/styles'

// eslint-disable-next-line
import { green, red } from 'logger'

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

const Rule = ({ rule, updateRule }) => {
  const classes = useStyles()
  const { _id, actions, criteria } = rule
  // green('rule', rule)
  return (
    // <div>hi ya</div>
    <div className={classes.rule}>
      <div>
        <div className={classes.ruleId}>RuleId: {_id}</div>
        <Criteria criteria={criteria} updateRule={updateRule} />
        <hr />
        <Actions actions={actions} />
      </div>
      <div>
        <button className={classes.actionButton}>Update</button>
        <button className={classes.actionButton}>Delete</button>
      </div>
    </div>
  )
}

export default Rule

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
