import React, { useEffect /*, useState */ } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { dataChangesReadRequest } from 'store/views/actions'
import Rule from 'ui/Rule'
import { getRules } from 'store/rules/selectors'
import { getDataChanges } from 'store/views/selectors'

// eslint-disable-next-line
import { green, red } from 'logger'


const useStyles = makeStyles({
  item: {
    padding: '8px 0 8px 12px',
    margin: 4
  },
  actionOrCriteria: {
    marginBottom: 2
  },
  description: {
    marginBottom: 4
  }
})

const DataChanges = ({ data, rules, dataChangesReadRequest }) => {
  
  useEffect(() => {
    ;(async () => {
      try {
        await dataChangesReadRequest('data-changes')
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [dataChangesReadRequest])


  const getRule = (ruleId) => {
    return rules.find(r => r._id === ruleId )
  }

  const classes = useStyles()

  const updateRule = ({ rule }) => {
    green('updateRule: rule', rule)
  }
  // green('data', data)
  return (
    <div>
      {data.map(d => {
        const { rules } = d
        // green('d', d)
        // green('rules', rules)
        return (
          <Paper className={classes.item}>
            
            <div className={classes.description}>{d._id}</div>
            <div>
              {d.orig.map(o => (
                <div>{o}</div>
              ))}
            </div>
            <div>
              {rules.map(ruleId => {
                return (
                  <Rule updateRule={updateRule} rule={getRule(ruleId)} />
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
  dataChangesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getDataChanges(state),
    rules: getRules(state)
  }
}

export default compose(connect(mapStateToProps, actions))(
  DataChanges
)
