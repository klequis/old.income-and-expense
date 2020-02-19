import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
// import Switch from '@material-ui/core/Switch'
// import FormGroup from '@material-ui/core/FormGroup'
// import FormControlLabel from '@material-ui/core/FormControlLabel'

// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles({
  nav: {
    paddingBottom: 24
  },
  loggedin: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userNickname: {
    fontSize: 32
  }
})

const Nav = ({ importData /*, showOmitted, showOrigDesc, filterChanged */ }) => {
  
  const classes = useStyles()

  // const handleOptionChange = name  => event => {
  //   filterChanged(name, event.target.checked)
  // }
  return (
    <div className={classes.nav}>
      <Button variant="outlined" onClick={importData}>
        Import Data
      </Button>
      <Button variant="outlined">Reload Data</Button>

      {/* <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={showOrigDesc}
              onChange={handleOptionChange('showOrigDesc')}
              value="showOrigDesc"
            />
          }
          label="Show Original Description"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showOmitted}
              onChange={handleOptionChange('showOmitted')}
              value="showOmitted"
              // color="primary"
            />
          }
          label="Show omitted"
        />
      </FormGroup> */}
    </div>
  )
}

export default Nav
