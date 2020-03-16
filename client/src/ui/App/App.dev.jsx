import React, { useEffect } from 'react'
import DevTools from 'ui/DevTools'
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/styles'
import { useFinanceContext } from 'financeContext'
import Nav from 'ui/Nav'
import AllDataByDescription from 'ui/views/AllDataByDescription'

// eslint-disable-next-line
import { green, red } from 'logger'

const useStyles = makeStyles({
  appTitle: {
    fontSize: 48,
    paddingTop: 32,
    paddingBottom: 32
  },
  devWrapper: {
    display: 'flex',
    alignItems: 'stretch'
  }
})

const App = () => {
  const { ruleTmpAdd, viewReadRequest, viewData } = useFinanceContext()

  useEffect(() => {
    ;(async () => {
      await viewReadRequest('all-data-by-description')
    })()
  }, [viewReadRequest])

  const classes = useStyles()


  return (
    <div className={classes.devWrapper}>
      <Container maxWidth={false}>
        <Nav importData={_importData} />
        <Switch>
          <Route path='/all-data-by-description'>
            <AllDataByDescription updateRulesAndData={_updateRulesAndData} />
          </Route>
        </Switch>
        
      </Container>
      {process.NODE_ENV !== 'production' ? <DevTools /> : null}
    </div>
  )
}

export default App

