import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import withStyles from 'react-jss'
import classNames from 'classnames'
import { clearToast } from 'store/toast/actions'
import { getToast } from 'store/toast/selectors'
import { TOAST_WARN, TOAST_INFO } from 'global-constants'
// eslint-disable-next-line
import { green } from 'logger'


const Toast = ({ classes, toast }) => {

  useEffect(() => {
    const timerId = setTimeout(() => clearToast(), 3000)
    return () => clearTimeout(timerId)
  })

  if (!toast) { return null }

  green('toast', toast)
  // green('toast', toast.validationErrors)


  const { level, id, message, error } = toast
  green('toast: error', error)
  // const wrapperStyle = classNames({
  //   [classes.wrapper]: true,
  //   [classes.info]: level === TOAST_INFO,
  //   [classes.warn]: level === TOAST_WARN
  // })

  return (
    <div key={id}>
      <h1>{message}</h1>
      <b>{error.statusText}</b>
    </div>
  )
}

// const styles = {
//   wrapper: {
//     position: 'fixed',
//     left: '2rem',
//     top: '4.75rem',
//     boxShadow: '0 .2rem .4rem rgba(0,0,0,.1)',
//     borderRadius: '.2rem',
//     padding: '1rem',
//     animationName: 'slideIn',
//     animationDuration: '.2s'
//   },
//   info: {
//     backgroundColor: 'black',
//     color: 'white'
//   },
//   warn: {
//     backgroundColor: '#b93f55',
//     color: 'white'
//   }
// }

const actions = { clearToast }

const mstp = state => {
  return {
    toast: getToast(state)
  }
}

export default compose(
  connect(mstp, actions)
)(Toast)
