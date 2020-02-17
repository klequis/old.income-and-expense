import React, { useState } from 'react'
// import Data from 'ui/Data'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/styles'
import DevTools from 'ui/DevTools'
// import Nav from 'ui/Nav'
// import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { importDataRequest } from 'store/data/actions'
import { getData } from 'store/data/selectors'
// import CategoryReport from 'ui/CategoryReport'
import RawData from 'ui/RawData'

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
  

  const classes = useStyles()

  // const { dataReadRequest, importDataRequest /*, data*/ } = props

  // const importData = async () => {
  //   await importDataRequest()
  //   await dataReadRequest(description, showOmitted)
  // }

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
      <Container fluid maxWidth={false}>
        {/* <Typography variant="h1" className={classes.appTitle} align="center">
          Finance
        </Typography> */}
        {/* <Nav
          importData={importData}
          filterChanged={filterChanged}
        /> */}
        {/* <Filter filterChanged={filterChanged} /> */}
        {/* <Data data={data} showOrigDesc={showOrigDesc} /> */}
        <RawData description={description} showOrigDesc={showOrigDesc} />
        {/* <CategoryReport /> */}
      </Container>
      {process.NODE_ENV !== 'production' ? <DevTools /> : null}
    </div>
  )
}

const actions = {
  importDataRequest
}

const mapStateToProps = state => {
  return {
    data: getData(state)
  }
}

export default compose(connect(mapStateToProps, actions))(App)
