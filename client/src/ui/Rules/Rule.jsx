import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Action from './Action'
import Criteria from './Criteria'

// eslint-disable-next-line
import { green, redf } from 'logger'

/*
  - action
  - field
  - findValue
  - numAdditionalChars
  - replaceWithValue
  - category1
  - category2
*/

/*
  - omit:       action
  - strip:      action, field, findValue, numAdditionalChars
  - replaceAll: action, field, replaceWithValue
  - categorize: action, category1, category2

*/

const useStyles = makeStyles({
  panel: {
    padding: '4px 8px 4px 48px'
  },
  criteria: {
    padding: '8px 12px'
  },
  sectionHeading: {
    fontSize: '1rem',
    fontWeight: 700,
    paddingTop: 30,
    paddingBottom: 15
  },
  actions: {
    paddingBottom: 30
  }
})

const Rule = ({ _id, criteria, actions }) => {
  const classes = useStyles()
  return (
    <form id="rule-form" className={classes.panel}>
      <div id="criteria">
        <div className={classes.sectionHeading}>Criteria</div>
        {criteria.map((c, idx) => {
          return <Criteria key={`${_id}-${idx}`} criteria={c} />
        })}
      </div>
      <div id="actions" className={classes.actions}>
        <div className={classes.sectionHeading}>Actions</div>
        {actions.map(a => (
          <Action action={a} />
        ))}
      </div>
    </form>
  )
}

export default Rule
