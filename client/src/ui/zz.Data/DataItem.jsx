import React from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles, createStyles } from '@material-ui/styles'
import { format } from 'date-fns'


// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles(theme =>
  createStyles({
    contentWrapper: {
      // display: 'flex',
      // flexWrap: 'nowrap',
      width: '100%',
      // justifyContent: 'space-between'
      // backgroundColor: 'red'
    },
    underline: {
      '&&&:before': {
        borderBottom: 'none'
      },
      '&:hover': {
        borderBottom: `2px solid ${theme.palette.text.primary}`
      }
    },
    date: {
      flexBasis: '9%',
      backgroundColor: 'red'
    },
    description: {
      flexBasis: '75%',
      // backgroundColor: 'green'
    },
    category: {
      // flexBasis: '10%',
      backgroundColor: 'blue'
    },
    omit: {
      // flexBasis: '10%',
      backgroundColor: 'orange'
    }
  })
)

const DataItem = ({ data, showOrigDesc }) => {
  const {
    description,
    origDescription,
    category1,
    category2,
    date,
    omit
  } = data

  const classes = useStyles()

  // green('showOrigDesc', showOrigDesc)

  return (
    <Paper className={classes.contentWrapper}>
      <div className={classes.date}>{format(new Date(date), 'MM/dd/yyyy')}</div>
      <div>
        <div className={classes.description}>{description}</div>
        {showOrigDesc ? (
          <div className={classes.description}>{origDescription}</div>
        ) : null}
      </div>
      <div className={classes.category}>{category1 || 'none'}</div>
      <div className={classes.category}>{category2}</div>
      <div className={classes.omit}>{omit ? 'yes' : 'no'}</div>
    </Paper>
  )
}

export default DataItem
