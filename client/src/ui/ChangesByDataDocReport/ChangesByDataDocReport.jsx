import React, { useEffect /*, useState */ } from 'react'
// import { makeStyles } from '@material-ui/styles'
// import MaterialTable from 'material-table'
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
    padding: 4,
    margin: 4
  }
})

const Criteria = ({ criteria }) => {
  green('criteria', criteria)
  return criteria.map(c => (
    <div>
      <div>
        <b>field: </b>
        {c.field}, <b>operation: </b>
        {c.operation} <b>value: </b>
        {c.value}}
      </div>
    </div>
  ))
}

const Actions = ({ actions }) => {
  return actions.map(a => {
    if (a.action === actionNames.omit) {
      return (
        <div>
          <b>Action: </b>
          {a.action}
        </div>
      )
    }
    if (a.action === actionNames.categorize) {
      return (
        <div>
          <b>Action: </b>{a.action}:{' '}
          <b>Category 1: </b>{a.category1},{' '}
          <b>Category 2: </b>{a.category2}{' '}
        </div>
      )
    }
    if (a.action === actionNames.replaceAll) {
      return <div>
        <b>Action: </b>{a.action}:{' '} 
        <b>Field: </b>{a.field},{' '}
        <b>Replace with: </b>{a.replaceWithValue}
        </div>
    }
    if (a.action === actionNames.strip) {
      return <div>
        <b>Action: </b>{a.action}:{' '}
        <b>Field: </b>{a.field},{' '}
        <b>Find value: </b>{a.findValue},{' '}
        
        <b>Num add chars: </b>{a.numAdditionalChars}
        </div>
    }
    return null
  })
}

const Rule = ({ rules }) => {
  // green('rule.length', rule.length)
  // green('rule', rules)
  if (rules.length > 0) {
    const a = rules.map(rule => {
      const { criteria, actions } = rule
      return (
        <div>
          <Criteria criteria={criteria} />
          <Actions actions={actions} />
        </div>
      )
    })
    green('a', a)
    return a
    // const a = rules.map(rule => {
    //   // green('rule', rule.criteria)
    //   return rule.criteria.map(c => (
    //     <div>
    //       <div>
    //         <b>field: </b>
    //         {c.field}, <b>operation: </b>
    //         {c.operation} <b>value: </b>
    //         {c.value}}
    //       </div>
    //     </div>
    //   ))
    // })
    // green('a', a)
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
        // green('d', d)
        const { rules } = d
        // green('rules', rules)
        return (
          <Paper className={classes.item}>
            <div>{d._id}</div>
            <div>
              {d.orig.map(o => (
                <div>{o}</div>
              ))}
            </div>
            <div>
              {rules.map(r => {
                // green('r', r)
                // return null
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
