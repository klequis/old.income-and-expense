import React, { useEffect /*, useState */ } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { changesByDataDocReadRequest } from 'store/reports/actions'
import { getChangesByDataDoc } from 'store/reports/selectors'
import { actions as actionNames } from 'global-constants'
import Criteria from './Criteria'
import Actions from './Actions'

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

const Rule = ({ rules, updateRule }) => {
  const classes = useStyles()
  if (rules.length > 0) {
    const a = rules.map(rule => {
      const { _id, criteria, actions } = rule
      // green('Rule: criteria', criteria)
      return (
        <div>
          <div className={classes.ruleId}>RuleId: {_id}</div>
          <Criteria criteria={criteria} updateRule={updateRule} />
          <Actions actions={actions} />
        </div>
      )
    })
    return a
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

  const updateRule = ({ rule }) => {
    green('updateRule: rule', rule)
  }

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
                    <Rule updateRule={updateRule} rules={r} />
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
