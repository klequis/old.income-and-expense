import React from 'react'
import DevTools from 'ui/DevTools'
import { Route, Switch } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/styles'
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

  const classes = useStyles()

  return (
    <div className={classes.devWrapper}>
      <Container maxWidth={false}>
        <Nav />
        <Switch>
          <Route path='/all-data-by-description'>
            <AllDataByDescription />
          </Route>
        </Switch>
        
      </Container>
      {process.NODE_ENV !== 'production' ? <DevTools /> : null}
    </div>
  )
}

export default App

