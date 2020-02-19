import { RULES_READ_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export function rulesReducer(
  state = [],
  action
) {
  switch (action.type) {
    case RULES_READ_KEY:
      blue('state', state)
      blue('action', action)
      return action.payload
    default:
      return state
  }
}