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
import { isNil } from 'ramda'

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

const DataChangesContainer = ({
  data,
  rules,
  dataChangesReadRequest,
  rulesReadRequest
}) => {
  let [pageIdx, setPageIdx] = useState(0)
  let [gotoIdx, setGotoIdx] = useState(0)
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
  }, [dataChangesReadRequest, rulesReadRequest])

  const getRule = ruleId => {
    const r = rules.find(r => r._id === ruleId)
    if (isNil(r)) {
      red('DataChangesContainer.getRule ERROR', `rule ${ruleId} not found`)
      return []
    }
    return r
  }

  const handlePageGotoChange = e => {
    const { name, value } = e.target

    const currPageIdx = Number(pageIdx)
    // const currGotoIdx = gotoIdx

    if (name === 'incrementPage') {
      const newIdx = currPageIdx + 1
      green('newIdx', newIdx)
      setPageIdx(newIdx)
      setGotoIdx(newIdx)
    }
    if (name === 'decrementPage') {
      const newIdx = currPageIdx - 1
      green('newIdx', newIdx)
      setPageIdx(newIdx)
      setGotoIdx(newIdx)
    }
    if (name === 'goto') {
      setGotoIdx(value)
      if (value !== '') {
        setPageIdx(Number(value))
      }
    }
  }

  if (loading) return <h1>Loading</h1>

  const groupOrigValues = array => {
    const grouped = array.reduce((acc, str) => {
      // acc.push(str)
      const key = str
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(str)
      return acc
    }, {})
    green('obj')
    return Object.keys(grouped).map(key => {
      return <div>{`${key} (${grouped[key].length})`}</div>
    })
  }
  green('pageIdx', pageIdx)
  green('gotoIdx', gotoIdx)
  return (
    <div>
      <div className={classes.pageCount}>
        page {pageIdx} of {data.length}
      </div>
      <div className={classes.actions}>
        <button
          className={classes.actionButton}
          name="decrementPage"
          onClick={handlePageGotoChange}
        >
          Previous
        </button>
        <button name="incrementPage" onClick={handlePageGotoChange}>
          Next
        </button>
        <div>
          <input
            type="text"
            name="goto"
            value={gotoIdx}
            onChange={handlePageGotoChange}
          />
        </div>
      </div>
      <Paper className={classes.paper}>
        <div className={classes.modifiedValue}>
          <b>Modified value</b>
          <div>{data[pageIdx]._id}</div>
          {data[pageIdx].category1.map(c => (
            <div key={shortid.generate()}>{c}</div>
          ))}
          {data[pageIdx].category2.map(c => (
            <div key={shortid.generate()}>{c}</div>
          ))}
        </div>
        <b>Original value(s)</b>
        <div>{groupOrigValues(data[pageIdx].orig)}</div>
        <div>
          <div className={classes.rulesTitle}>Rules</div>
          {data[pageIdx].rules.map(ruleId => {
            return <Rule key={shortid.generate()} rule={getRule(ruleId)} />
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
