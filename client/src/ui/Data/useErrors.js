import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { append, remove } from 'ramda'
// eslint-disable-next-line
import { green } from 'logger'


export const useErrors = selector => {
  const [validationErrors, setValidationErrors] = useState([])
  // green('top of useErrors')
  // green('validationErrors', validationErrors)

  const setError = (field, message = '') => {
    green(`setError: field: ${field}, message ${message}`)
    // If an error for this field already exists, remove it
    const idx = validationErrors.findIndex(e => e.field === field)
    let errs1 = []
    if (idx > -1) {
      errs1 = remove(idx, 1, validationErrors)
    }
    // TODO: (why?) if there is a message append the error
    if (message !== '') {
      setValidationErrors(
        append(
          {
            field,
            message
          },
          errs1
        )
      )
    } else {
      // TODO: (makes no sense)  Otherwise, replace all errors with the current one
      setValidationErrors(errs1)
    }
  }

  // get an error from the existing errors or return ''
  // green('validationErrors', validationErrors)
  // green('above getError')
  const getError = field => {
    // intermitent problem here
    // TypeError: Cannot read property 'find' of undefined
    const err = validationErrors.find(e => e.field === field)
    if (err) {
      return err.message
    } else {
      return ''
    }
  }

  // Any server validation errors will be in redux
  const serverValidationErrors = useSelector(selector)

  /*
      Server errors are { param: [string], msg: [string] }
      When set to set error it will be { field: [string], message: [string] } 
        in the validationErrors state variable
  */
  useEffect(
    () => serverValidationErrors.forEach(e => setError(e.param, e.msg)),
    // eslint-disable-next-line
    [serverValidationErrors] // don't include setError
  )

  // green('validationErrors', validationErrors)

  return {
    setError: (...p) => setError(...p),
    getError: (...p) => getError(...p)
  }
}
