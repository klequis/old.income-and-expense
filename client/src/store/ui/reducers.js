import { ROW_ID_SHOW_CLEAR_KEY, ROW_ID_SHOW_SET_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export const rowIdShowReducer = (state = '', { type, payload }) => {
  switch (type) {
    case ROW_ID_SHOW_CLEAR_KEY:
      // payload will be a string id
      return ''
    case ROW_ID_SHOW_SET_KEY:
      return payload
    default:
      return state
  }
}
