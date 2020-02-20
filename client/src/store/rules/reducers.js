import { RULES_READ_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export function rulesReducer(
  state = [],
  action
) {
  switch (action.type) {
    case RULES_READ_KEY:
      return action.payload
    default:
      return state
  }
}