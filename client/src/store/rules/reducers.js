import { RULES_READ_KEY, RULES_UPDATE_RULE_KEY } from './constants'

// eslint-disable-next-line
import { blue } from 'logger'

export function rulesReducer(state = [], action) {
  switch (action.type) {
    case RULES_READ_KEY:
      return action.payload
    case RULES_UPDATE_RULE_KEY:
      return state
    default:
      return state
  }
}
