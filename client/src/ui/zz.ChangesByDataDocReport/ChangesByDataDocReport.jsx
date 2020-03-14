import React, { useEffect /*, useState */ } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { dataChangesReadRequest } from 'store/views/actions'
import { getDataChanges } from 'store/views/selectors'
import Rule from './Rule'

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

const ChangesByDataDocReport = ({ data, dataChangesReadRequest }) => {
  useEffect(() => {
    ;(async () => {
      try {
        await dataChangesReadRequest('changes-by-data-doc')
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [dataChangesReadRequest])

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
  dataChangesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getDataChanges(state)
  }
}

export default compose(connect(mapStateToProps, actions))(
  ChangesByDataDocReport
)
