import React, { useEffect, useState } from 'react'
// import Data from 'ui/Data'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/styles'
import DevTools from 'ui/DevTools'
import Nav from 'ui/Nav'
// import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { importDataRequest, dataReadRequest } from 'store/data/actions'
import { rulesReadRequest } from 'store/rules/actions'
import { getRules } from 'store/rules/selectors'
import { getData } from 'store/data/selectors'

// import AmountByCategoryReport from 'ui/AmountByCategoryReport'
import RawData from 'ui/RawData'
// import Rules from 'ui/Rules'
// import ChangesByDataDocReport from 'ui/ChangesByDataDocReport'
import DataChanges from 'ui/DataChanges'
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'

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
  const [description, setDescription] = useState('')
  const [showOrigDesc, setShowOrigDesc] = useState(true)
  const [showOmitted, setShowOmitted] = useState(false)

  const classes = useStyles()

  const {
    dataReadRequest,
    importDataRequest,
    rulesReadRequest,
    data,
    rules
  } = props

  const currentPath = props.location.pathname
  // green('App: currentPath', currentPath)
  useEffect(() => {
    ;(async () => {
      try {
        if (currentPath === '/') {
          // await rulesReadRequest()
          await dataReadRequest(description, showOmitted)
        }
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [rulesReadRequest, dataReadRequest, description, showOmitted])

  const importData = async () => {
    await importDataRequest()
  }

  // const filterChanged = (name, value) => {
  //   if (name === 'descriptionFilter') {
  //     setDescription(value)
  //   }
  //   if (name === 'showOrigDesc') {
  //     setShowOrigDesc(value)
  //   }
  //   if (name === 'showOmitted') {
  //     setShowOmitted(value)
  //   }
  //   // const f = { omit: options.showOmitted }
  //   // green('filterChanged: f', f)
  //   // setDescription(f)
  // }

  // const handleOptionChange = name => event => {
  //   setOptions({ ...options, [name]: event.target.checked })
  //   filterChanged()
  // }

  return (
    <div className={classes.devWrapper}>
      <Container maxWidth={false}>
        <Nav
          importData={importData}
          // filterChanged={filterChanged}
        />
        <switch>
          <Route exact path="/" component={RawData} />
          <Route exact path="/data-changes" component={DataChanges} />
        </switch>
        {/* <Filter filterChanged={filterChanged} /> */}
        {/* <Data data={data} showOrigDesc={showOrigDesc} /> */}
        {/* <DetailPanel /> */}
        {/* <RawData description={description} showOrigDesc={showOrigDesc} /> */}
        {/* <AmountByCategoryReport /> */}
        {/* <Rules /> */}
      </Container>
      {process.NODE_ENV !== 'production' ? <DevTools /> : null}
    </div>
  )
}

const actions = {
  importDataRequest,
  dataReadRequest,
  rulesReadRequest
}

const mapStateToProps = state => {
  return {
    data: getData(state),
    rules: getRules(state)
  }
}

export default compose(withRouter, connect(mapStateToProps, actions))(App)
