import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import { useFinanceContext } from 'financeContext'

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

const Nav = ({ importData }) => {
  const { importDataRequest } = useFinanceContext()
  const classes = useStyles()

  return (
    <div className={classes.nav}>
      <Button variant="outlined" onClick={() => importDataRequest()}>
        Import Data
      </Button>
    </div>
  )
}

export default Nav
