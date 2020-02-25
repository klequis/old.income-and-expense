import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { dataChangesReadRequest } from 'store/views/actions'
import { rulesReadRequest } from 'store/rules/actions'
import Rule from 'ui/Rule'
import { getRules } from 'store/rules/selectors'
import { getDataChanges } from 'store/views/selectors'
import shortid from 'shortid'

// eslint-disable-next-line
import { green, blue, red } from 'logger'

const useStyles = makeStyles({
  paper: {
    padding: 8
  },
  pageCount: {
    marginBottom: 8
  },
  actions: {
    marginBottom: 8
  },
  actionButton: {
    marginRight: 8
  },
  modifiedValue: {
    marginBottom: 4
  },
  rulesTitle: {
    fontWeight: 'bold',
    fontSize: '1.2em',
    paddingTop: 8,
    paddingBottom: 4
  }
})

const DataChangesContainer = ({ data, rules, dataChangesReadRequest, rulesReadRequest }) => {
  let [pageIdx, setPageIdx] = useState(0)
  let [loading, setLoading] = useState(true)

  const classes = useStyles()

  useEffect(() => {
    ;(async () => {
      try {
        await dataChangesReadRequest('data-changes')
        await rulesReadRequest()
        setLoading(false)
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [dataChangesReadRequest])

  const getRule = ruleId => {
    return rules.find(r => r._id === ruleId)
  }

  const updateRule = ({ rule }) => {
    green('updateRule: rule', rule)
  }

  if (loading) return <h1>Loading</h1>

  return (
    <div>
      <div className={classes.pageCount}>
        page {pageIdx} of {data.length}
      </div>
      <div className={classes.actions}>
        <button
          className={classes.actionButton}
          onClick={() => setPageIdx(pageIdx - 1)}
        >
          Previous
        </button>
        <button onClick={() => setPageIdx(pageIdx + 1)}>Next</button>
      </div>
      <Paper className={classes.paper}>
        <div className={classes.modifiedValue}>
          <b>Modified value</b>
          <div>{data[pageIdx]._id}</div>
        </div>
        <b>Original value(s)</b>
        <div>
          {data[pageIdx].orig.map(o => (
            <div key={shortid.generate()}>{o}</div>
          ))}
        </div>
        <div>
          <div className={classes.rulesTitle}>Rules</div>
          {data[pageIdx].rules.map(ruleId => {
            return (
              <Rule
                key={shortid.generate()}
                updateRule={updateRule}
                rule={getRule(ruleId)}
              />
            )
          })}
        </div>
      </Paper>
    </div>
  )
}

const actions = {
  dataChangesReadRequest,
  rulesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getDataChanges(state),
    rules: getRules(state)
  }
}

export default compose(connect(mapStateToProps, actions))(DataChangesContainer)
