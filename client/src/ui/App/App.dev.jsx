import React, { useEffect, useState } from 'react'
import Data from 'ui/Data'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/styles'
import DevTools from 'ui/DevTools'
import Nav from 'ui/Nav'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { dataReadRequest, importDataRequest } from 'store/data/actions'
import { getData } from 'store/data/selectors'
import Filter from 'ui/Filter'

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
  const [ showOrigDesc, setShowOrigDesc] = useState(false)
  const [showOmitted, setShowOmitted] = useState(false)
  

  const classes = useStyles()

  const { dataReadRequest, importDataRequest, data } = props

  useEffect(() => {
    ;(async () => {
      try {
        green('useEffect: filter', description)
        await dataReadRequest(description, showOmitted)
      } catch (e) {
        console.log('TheError', e)
      }
    })()
  }, [dataReadRequest, description, showOmitted])

  const importData = async () => {
    await importDataRequest()
    await dataReadRequest(description, showOmitted)
  }


  const filterChanged = (name, value) => {
    if (name === 'descriptionFilter') {
      setDescription(value)
    }
    if (name === 'showOrigDesc') {
      setShowOrigDesc(value)
    }
    if (name === 'showOmitted') {
      setShowOmitted(value)
    }
    // const f = { omit: options.showOmitted }
    // green('filterChanged: f', f)
    // setDescription(f)
  }

  // const handleOptionChange = name => event => {
  //   setOptions({ ...options, [name]: event.target.checked })
  //   filterChanged()
  // }

  return (
    <div className={classes.devWrapper}>
      <Container fluid maxWidth={false}>
        <Typography variant="h1" className={classes.appTitle} align="center">
          Finance
        </Typography>
        <Nav
          importData={importData}
          filterChanged={filterChanged}
          // options={options}
          // handleOptionChange={handleOptionChange}
        />
        <Filter filterChanged={filterChanged} />
        <Data data={data} showOrigDesc={showOrigDesc} />
      </Container>
      {process.NODE_ENV !== 'production' ? <DevTools /> : null}
    </div>
  )
}

const actions = {
  dataReadRequest,
  importDataRequest
}

const mapStateToProps = state => {
  return {
    data: getData(state)
    // userId: getUserId(state)
  }
}

export default compose(connect(mapStateToProps, actions))(App)
