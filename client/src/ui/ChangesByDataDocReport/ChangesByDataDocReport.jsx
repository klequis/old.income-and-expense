import React, { useEffect /*, useState */ } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { changesByDataDocReadRequest } from 'store/reports/actions'
import { getChangesByDataDoc } from 'store/reports/selectors'
import { actions as actionNames } from 'global-constants'

// eslint-disable-next-line
import { green, red } from 'logger'

const useStyles = makeStyles({
  item: {
    padding: '8px 0 8px 12px',
    margin: 4
  },
  ruleId: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold'
  },
  actionOrCriteria: {
    marginBottom: 2
  },
  description: {
    marginBottom: 4
  }
})

const Criteria = ({ criteria }) => {
  const classes = useStyles()
  return criteria.map(c => (
    <div>
      <div className={classes.actionOrCriteria}>
        <b>field: </b>
        {c.field}, <b>operation: </b>
        {c.operation} <b>value: </b>
        {c.value}}
      </div>
    </div>
  ))
}

const Actions = ({ actions }) => {
  const classes = useStyles()
  return actions.map(a => {
    if (a.action === actionNames.omit) {
      return (
        <div style={{ color: 'red' }} className={classes.actionOrCriteria}>
          <b>Action: </b>
          {a.action}
        </div>
      )
    }
    if (a.action === actionNames.categorize) {
      return (
        <div className={classes.actionOrCriteria}>
          <b>Action: </b>
          {a.action}: <b>Category 1: </b>
          {a.category1}, <b>Category 2: </b>
          {a.category2}{' '}
        </div>
      )
    }
    if (a.action === actionNames.replaceAll) {
      return (
        <div className={classes.actionOrCriteria}>
          <b>Action: </b>
          {a.action}: <b>Field: </b>
          {a.field}, <b>Replace with: </b>
          {a.replaceWithValue}
        </div>
      )
    }
    if (a.action === actionNames.strip) {
      return (
        <div className={classes.actionOrCriteria}>
          <b>Action: </b>
          {a.action}: <b>Field: </b>
          {a.field}, <b>Find value: </b>
          {a.findValue}, <b>Num add chars: </b>
          {a.numAdditionalChars}
        </div>
      )
    }
    return null
  })
}

const Rule = ({ rules }) => {
  const classes = useStyles()
  if (rules.length > 0) {
    const a = rules.map(rule => {
      const { _id, criteria, actions } = rule
      return (
        <div>
          <div className={classes.ruleId}>RuleId: {_id}</div>
          <Criteria criteria={criteria} />
          <Actions actions={actions} />
        </div>
      )
    })
  }
  return null
}

const ChangesByDataDocReport = ({ data, changesByDataDocReadRequest }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await changesByDataDocReadRequest('changes-by-data-doc')
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [changesByDataDocReadRequest])
  const classes = useStyles()
  return (
    <div>
      {data.map(d => {
        const { rules } = d
        return (
          <Paper className={classes.item}>
            <div className={classes.description}>{d._id}</div>
            <div>
              {d.orig.map(o => (
                <div>{o}</div>
              ))}
            </div>
            <div>
              {rules.map(r => {
                return (
                  <div>
                    <Rule rules={r} />
                  </div>
                )
              })}
            </div>
          </Paper>
        )
      })}
    </div>
  )
}

const actions = {
  changesByDataDocReadRequest
}

const mapStateToProps = state => {
  return {
    data: getChangesByDataDoc(state)
  }
}

export default compose(connect(mapStateToProps, actions))(
  ChangesByDataDocReport
)
