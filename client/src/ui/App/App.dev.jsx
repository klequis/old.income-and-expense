import React, { useState } from 'react'
// Redux
import DevTools from 'ui/DevTools'
import { connect } from 'react-redux'
import { compose } from 'recompose'
// Store
import { importDataRequest, dataReadRequest } from 'store/data/actions'
import { rulesReadRequest } from 'store/rules/actions'
import { getRules } from 'store/rules/selectors'
import { getData } from 'store/data/selectors'
import { viewReadRequest } from 'store/views/actions'
// React Router
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'
// MUI
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/styles'
// views
import RawData from 'ui/views/RawData'
import AllDataByDescription from 'ui/views/AllDataByDescription'


// other
import Nav from 'ui/Nav'
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

const App = props => {
  
  const classes = useStyles()

  const {
    importDataRequest,
    rulesReadRequest,
    viewReadRequest
  } = props

  const _updateRulesAndData = async (view) => {
    try {
      
      await rulesReadRequest()
      await viewReadRequest(view)
      
    } catch (e) {
      red('App.dev ERROR', e.message)
      console.log(e)
    }
  }

  // useEffect(() => {
  //   ;(async () => {
  //     await _updateRulesAndData
  //   })()
  // }, [rulesReadRequest, dataReadRequest, description, showOmitted])

  const _importData = async () => {
    await importDataRequest()
    // await rulesReadRequest()
    // await dataReadRequest(description, showOmitted)
    // await _updateRulesAndData
  }

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

const actions = {
  importDataRequest,
  rulesReadRequest,
  viewReadRequest
}

const mapStateToProps = state => {
  return {
    data: getData(state),
    rules: getRules(state)
  }
}

export default compose(withRouter, connect(mapStateToProps, actions))(App)


























////////////////////////////////////////////









