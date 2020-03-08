import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { dataChangesReadRequest } from 'store/views/actions'
import Rule from 'ui/Rule'
import { getRules } from 'store/rules/selectors'
import { getDataChanges } from 'store/views/selectors'
import shortid from 'shortid'

// eslint-disable-next-line
import { green, blue, red } from 'logger'

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
  let [pageIdx, setPageIdx] = useState(0)
  // const [page, setPage] = useState(data[pageIdx])
  useEffect(() => {
    ;(async () => {
      try {
        await dataChangesReadRequest('data-changes')
        // blue('**** hello')
        // setPage(data[pageIdx])
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [dataChangesReadRequest /*, setPage, pageIdx, data*/])

  // useEffect(() => {
  //   green('**** settingPage', pageIdx)
  //   setPage(data[pageIdx])
  // }, [data, pageIdx])

  const getRule = ruleId => {
    return rules.find(r => r._id === ruleId)
  }

  const classes = useStyles()

    // green('data', data)
  // green('pageIdx', pageIdx)

  if (data.length === 0) return null
  // green('data', data)
  const page = data[pageIdx]
  // green('page', page)

  // green('data[pageIdx]', data[pageIdx])
  const handleActionClick = event => {
    const name = event.target.name
    green('name', name)
    green('pageIdx', pageIdx)
    if (name === 'next') {
      const idx = pageIdx++
      green('newIdx', idx)
      setPageIdx(idx)
    } else {
      const idx = pageIdx--
      setPageIdx(idx)
    }
  }
  return (
    <div>
      <Paper className={classes.item}>
        {/* <div className={classes.description}>{data[pageIdx]._id}</div> */}
        <div className={classes.description}>{page._id}</div>
        <div>
          {/* {d.orig.map(o => (
            <div key={shortid.generate()}>{o}</div>
          ))} */}
        </div>
      </Paper>
      <div className={classes.actions}>
        <button disabled={pageIdx === 0} name="previous" onClick={() => setPageIdx(pageIdx + 1)}>
          Previous
        </button>
        <button
          disabled={pageIdx === data.length}
          name="next"
          onClick={() => setPageIdx(pageIdx - 1)}
        >
          Next
        </button>
      </div>
      {/* {data.map(d => {
        const { rules } = d
        // green('d', d)
        // green('rules', rules)
        return (
          <Paper key={shortid.generate()} className={classes.item}>
            
            <div className={classes.description}>{d._id}</div>
            <div>
              {d.orig.map(o => (
                <div key={shortid.generate()}>{o}</div>
              ))}
            </div>
            <div>
              {rules.map(ruleId => {
                return (
                  <Rule key={shortid.generate()} updateRule={updateRule} rule={getRule(ruleId)} />
                )
              })}
            </div>
          </Paper>
        )
      })} */}
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

export default compose(connect(mapStateToProps, actions))(DataChanges)
