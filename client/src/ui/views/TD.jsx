import React from 'react'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'

// eslint-disable-next-line
import { green } from 'logger'

const useStyles = makeStyles({
  td: {
    // paddingRight: 10,
    // paddingTop: 5,
    // paddingBottom: 5,
    padding: '5px',
    maxWidth: 500
  },
  right: {
    textAlign: 'right'
  },
  left: {
    textAlign: 'left'
  }
})

const TD = ({ align, children }) => {
  // green('data', data)
  // green('align', align)
  const classes = useStyles()
  const modClasses = classNames([classes.td], {
    [classes.right]: (align === 'right'),
    [classes.left]: (align === 'left')
  })
  // green('modClasses', modClasses)

  return <td className={modClasses}>{children}</td>
}

export default TD
