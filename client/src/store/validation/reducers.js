import { CLEAR_VALIDATION_ERRORS, SET_VALIDATION_ERRORS } from './constants'
// import { merge } from 'ramda'

// eslint-disable-next-line
import { blue } from 'logger'

export function validationErrorsReducer(state = [], action) {
  // blue('validationErrorsReducer.state', state)
  // blue('validationErrorsReducer.action', action)
  
  switch (action.type) {
    case CLEAR_VALIDATION_ERRORS:
      // blue('validationErrorsReducer.state', state)
      // blue('validationErrorsReducer.action', action)

      // blue(`action`, action)
      // return merge(state, {
      //   [action.requestKey]: { status: REQUEST_PENDING, error: null }
      // })
      // TODO: does not seem this would clearn the errors. Maybe just return [] always
      return state
    case SET_VALIDATION_ERRORS:
      // blue('validationErrorsReducer.state', state)
      // blue('validationErrorsReducer.action', action)

      // blue('validation: payload.errors', action.payload.errors)
      // return merge(state, {
      //   [action.requestKey]: { status: REQUEST_SUCCESS, error: null }
      // })
      const o = action.payload.errors || []
      return o
    default:
      return state
  }
}
